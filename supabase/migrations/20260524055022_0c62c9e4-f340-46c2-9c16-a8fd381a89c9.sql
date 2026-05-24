DROP POLICY IF EXISTS "Authenticated users can view quiz results" ON public.quiz_results;
CREATE POLICY "Users can view their own quiz results"
ON public.quiz_results
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Profiles are viewable by authenticated users" ON public.profiles;
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);