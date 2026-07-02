-- Create banners table
CREATE TABLE IF NOT EXISTS banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  image_path TEXT,
  cta_text TEXT,
  cta_url TEXT,
  banner_type TEXT DEFAULT 'hero' CHECK (banner_type IN ('hero', 'promotional', 'announcement', 'seasonal')),
  background_color TEXT,
  text_color TEXT,
  display_order INTEGER DEFAULT 0,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_banners_type ON banners(banner_type);
CREATE INDEX idx_banners_active ON banners(is_active);
CREATE INDEX idx_banners_date_range ON banners(start_date, end_date);
CREATE INDEX idx_banners_order ON banners(display_order);

-- Enable RLS
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Everyone can view active banners within date range
CREATE POLICY "Everyone can view active banners"
  ON banners FOR SELECT
  USING (
    is_active = true 
    AND (start_date IS NULL OR start_date <= now())
    AND (end_date IS NULL OR end_date >= now())
  );

-- RLS Policy: Admins can view all banners
CREATE POLICY "Admins can view all banners"
  ON banners FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid() AND au.role IN ('Admin', 'Editor')
    )
  );

-- RLS Policy: Only admins can insert
CREATE POLICY "Only admins can insert banners"
  ON banners FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid() AND au.role IN ('Admin', 'Editor')
    )
  );

-- RLS Policy: Only admins can update
CREATE POLICY "Only admins can update banners"
  ON banners FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid() AND au.role IN ('Admin', 'Editor')
    )
  );

-- RLS Policy: Only admins can delete
CREATE POLICY "Only admins can delete banners"
  ON banners FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid() AND au.role = 'Admin'
    )
  );

-- Create trigger
CREATE OR REPLACE FUNCTION update_banners_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_banners_updated_at
  BEFORE UPDATE ON banners
  FOR EACH ROW
  EXECUTE FUNCTION update_banners_updated_at();
