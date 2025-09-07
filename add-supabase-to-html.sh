#!/bin/bash

# Script to add Supabase script to all HTML files that don't already have it

echo "Adding Supabase script to remaining HTML files..."

# Find all HTML files that don't already have the Supabase script
html_files=$(find . -name "*.html" -exec grep -L "supabase.createClient" {} \;)

for file in $html_files; do
    echo "Processing: $file"
    
    # Check if the file has the expected pattern to replace
    if grep -q "<!-- ❌ DO NOT put AdSense in <head> with data-cookieconsent -->" "$file" && grep -q "</head>" "$file"; then
        # Create a temporary file
        temp_file=$(mktemp)
        
        # Use sed to add the Supabase script before </head>
        sed '/<!-- ❌ DO NOT put AdSense in <head> with data-cookieconsent -->/,/^<\/head>/{
            s|</head>|  <!-- Supabase JavaScript Client -->\
  <script src="https://unpkg.com/@supabase/supabase-js@2"></script>\
  <script>\
    // Replace with your actual Supabase URL and anon key\
    // window.supabase = supabase.createClient('\''YOUR_SUPABASE_URL'\'', '\''YOUR_SUPABASE_ANON_KEY'\'');\
  </script>\
</head>|
        }' "$file" > "$temp_file"
        
        # Replace the original file with the modified one
        mv "$temp_file" "$file"
        echo "  ✅ Added Supabase script to $file"
    else
        echo "  ⚠️  Skipping $file - pattern not found"
    fi
done

echo "Done! Supabase script has been added to all applicable HTML files."
