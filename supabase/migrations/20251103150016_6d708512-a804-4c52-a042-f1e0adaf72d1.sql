-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('administrador', 'cocina', 'encuestador', 'comensal');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Surveys table
CREATE TABLE public.surveys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_by UUID REFERENCES public.profiles(id) NOT NULL,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.surveys ENABLE ROW LEVEL SECURITY;

-- Survey questions table
CREATE TABLE public.survey_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id UUID REFERENCES public.surveys(id) ON DELETE CASCADE NOT NULL,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN ('multiple_choice', 'scale', 'text')),
  options JSONB,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.survey_questions ENABLE ROW LEVEL SECURITY;

-- Survey responses table
CREATE TABLE public.survey_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id UUID REFERENCES public.surveys(id) ON DELETE CASCADE NOT NULL,
  question_id UUID REFERENCES public.survey_questions(id) ON DELETE CASCADE NOT NULL,
  respondent_id UUID REFERENCES public.profiles(id),
  response_value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;

-- Waste records table
CREATE TABLE public.waste_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  waste_type TEXT NOT NULL CHECK (waste_type IN ('vegetal', 'carbon', 'mixto')),
  quantity_kg DECIMAL(10, 2) NOT NULL,
  destination TEXT NOT NULL CHECK (destination IN ('compostaje', 'donacion', 'basura')),
  recorded_by UUID REFERENCES public.profiles(id) NOT NULL,
  record_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.waste_records ENABLE ROW LEVEL SECURITY;

-- Menu items table
CREATE TABLE public.menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dish_name TEXT NOT NULL,
  category TEXT NOT NULL,
  acceptance_rate DECIMAL(5, 2) DEFAULT 0,
  waste_percentage DECIMAL(5, 2) DEFAULT 0,
  recommended_portions INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- RLS Policies for user_roles
CREATE POLICY "Users can view all roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'administrador'));

-- RLS Policies for surveys
CREATE POLICY "Anyone can view published surveys"
  ON public.surveys FOR SELECT
  TO authenticated
  USING (is_published = true OR created_by = auth.uid() OR public.has_role(auth.uid(), 'administrador') OR public.has_role(auth.uid(), 'encuestador'));

CREATE POLICY "Encuestadores and admins can create surveys"
  ON public.surveys FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'encuestador') OR public.has_role(auth.uid(), 'administrador'));

CREATE POLICY "Survey creators can update their surveys"
  ON public.surveys FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid() OR public.has_role(auth.uid(), 'administrador'));

-- RLS Policies for survey questions
CREATE POLICY "Anyone can view questions of accessible surveys"
  ON public.survey_questions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.surveys
      WHERE surveys.id = survey_id
      AND (is_published = true OR created_by = auth.uid() OR public.has_role(auth.uid(), 'administrador') OR public.has_role(auth.uid(), 'encuestador'))
    )
  );

CREATE POLICY "Survey creators can manage questions"
  ON public.survey_questions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.surveys
      WHERE surveys.id = survey_id
      AND (created_by = auth.uid() OR public.has_role(auth.uid(), 'administrador'))
    )
  );

-- RLS Policies for survey responses
CREATE POLICY "Users can view responses"
  ON public.survey_responses FOR SELECT
  TO authenticated
  USING (
    respondent_id = auth.uid() OR
    public.has_role(auth.uid(), 'administrador') OR
    public.has_role(auth.uid(), 'encuestador') OR
    EXISTS (
      SELECT 1 FROM public.surveys
      WHERE surveys.id = survey_id
      AND created_by = auth.uid()
    )
  );

CREATE POLICY "Authenticated users can submit responses"
  ON public.survey_responses FOR INSERT
  TO authenticated
  WITH CHECK (respondent_id = auth.uid());

-- RLS Policies for waste records
CREATE POLICY "Users can view all waste records"
  ON public.waste_records FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Kitchen and admins can create waste records"
  ON public.waste_records FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'cocina') OR public.has_role(auth.uid(), 'administrador'));

CREATE POLICY "Record creators can update their records"
  ON public.waste_records FOR UPDATE
  TO authenticated
  USING (recorded_by = auth.uid() OR public.has_role(auth.uid(), 'administrador'));

-- RLS Policies for menu items
CREATE POLICY "Everyone can view menu items"
  ON public.menu_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Kitchen and admins can manage menu items"
  ON public.menu_items FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'cocina') OR public.has_role(auth.uid(), 'administrador'));