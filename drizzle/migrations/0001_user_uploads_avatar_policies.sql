CREATE POLICY "Investors read own avatar" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'user-uploads' AND name LIKE 'avatars/' || auth.uid()::text || '.%');
CREATE POLICY "Investors upload own avatar" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'user-uploads' AND name LIKE 'avatars/' || auth.uid()::text || '.%');
CREATE POLICY "Investors replace own avatar" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'user-uploads' AND name LIKE 'avatars/' || auth.uid()::text || '.%')
  WITH CHECK (bucket_id = 'user-uploads' AND name LIKE 'avatars/' || auth.uid()::text || '.%');
CREATE POLICY "Investors delete own avatar" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'user-uploads' AND name LIKE 'avatars/' || auth.uid()::text || '.%');
