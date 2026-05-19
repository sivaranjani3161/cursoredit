const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const replacements = [
  // Lib
  { from: /@\/lib\/api/g, to: '@/shared/lib/api' },
  { from: /@\/lib\/imageUtils/g, to: '@/shared/lib/imageUtils' },
  
  // Types
  { from: /@\/types\/blog/g, to: '@/features/blog/types/blog' },
  { from: /@\/types\/course/g, to: '@/features/courses/types/course' },
  { from: /@\/types\/gallery/g, to: '@/features/gallery/types/gallery' },
  { from: /@\/types\/collage/g, to: '@/features/gallery/types/collage' },
  { from: /@\/types\/event/g, to: '@/features/gallery/types/event' },
  { from: /@\/types\/contact/g, to: '@/features/contact/types/contact' },
  { from: /@\/types\/testimonial/g, to: '@/features/home/types/testimonial' },
  { from: /@\/types\/navbar/g, to: '@/shared/types/navbar' },
  
  // Data
  { from: /@\/data\/events\//g, to: '@/features/gallery/data/events/' },
  { from: /@\/data\/gallerydata/g, to: '@/features/gallery/data/gallerydata' },
  { from: /@\/data\/collageData/g, to: '@/features/gallery/data/collageData' },
  { from: /@\/data\/about-feature/g, to: '@/features/about/data/about-feature' },
  { from: /@\/data\/about/g, to: '@/features/about/data/about' },
  { from: /@\/data\/team/g, to: '@/features/about/data/team' },
  { from: /@\/data\/whatWeOffer/g, to: '@/features/about/data/whatWeOffer' },
  { from: /@\/data\/courses/g, to: '@/features/courses/data/courses' },
  { from: /@\/data\/CourseEnroll/g, to: '@/features/courses/data/CourseEnroll' },
  { from: /@\/data\/Coursefeaturesdata/g, to: '@/features/courses/data/Coursefeaturesdata' },
  { from: /@\/data\/Courseherodata/g, to: '@/features/courses/data/Courseherodata' },
  { from: /@\/data\/Coursestructuredata/g, to: '@/features/courses/data/Coursestructuredata' },
  { from: /@\/data\/Keyfeaturesdata/g, to: '@/features/courses/data/Keyfeaturesdata' },
  { from: /@\/data\/contact/g, to: '@/features/contact/data/contact' },
  { from: /@\/data\/hero/g, to: '@/features/home/data/hero' },
  { from: /@\/data\/features/g, to: '@/features/home/data/features' },
  { from: /@\/data\/metrics/g, to: '@/features/home/data/metrics' },
  { from: /@\/data\/partners/g, to: '@/features/home/data/partners' },
  { from: /@\/data\/navbar/g, to: '@/shared/data/navbar' },
  
  // Components (Features)
  { from: /@\/components\/Aboutus\//g, to: '@/features/about/components/' },
  { from: /@\/components\/blog\//g, to: '@/features/blog/components/' },
  { from: /@\/components\/Blogs/g, to: '@/features/blog/components/Blogs' },
  { from: /@\/components\/Courses\//g, to: '@/features/courses/components/' },
  { from: /@\/components\/CourseCard/g, to: '@/features/courses/components/CourseCard' },
  { from: /@\/components\/CoursesSection/g, to: '@/features/courses/components/CoursesSection' },
  { from: /@\/components\/Gallery\//g, to: '@/features/gallery/components/' },
  { from: /@\/components\/Contact\//g, to: '@/features/contact/components/' },
  
  { from: /@\/components\/ApproachSection/g, to: '@/features/home/components/ApproachSection' },
  { from: /@\/components\/Hero/g, to: '@/features/home/components/Hero' },
  { from: /@\/components\/MetricsSection/g, to: '@/features/home/components/MetricsSection' },
  { from: /@\/components\/PartnersCarousel/g, to: '@/features/home/components/PartnersCarousel' },
  { from: /@\/components\/Testimonials/g, to: '@/features/home/components/Testimonials' },
  { from: /@\/components\/VideoTestimonials/g, to: '@/features/home/components/VideoTestimonials' },
  { from: /@\/components\/WhyChooseUs/g, to: '@/features/home/components/WhyChooseUs' },
  
  // Components (Shared)
  { from: /@\/components\/Navbar/g, to: '@/shared/components/Navbar' },
  { from: /@\/components\/Footer/g, to: '@/shared/components/Footer' },
  { from: /@\/components\/AutoPopup/g, to: '@/shared/components/AutoPopup' },
  { from: /@\/components\/Enquirymodel/g, to: '@/shared/components/EnquiryModal' },
  
  // Local imports within components fixing (e.g. `../data/` to `../../data/`)
  // Let's first fix all `@/` aliases to be safe. If there are relative imports, we might need manual fixes.
];

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (/\.(ts|tsx)$/.test(file)) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;
      
      for (const { from, to } of replacements) {
        if (from.test(content)) {
          content = content.replace(from, to);
          modified = true;
        }
      }
      
      // Also catch relative imports if they were moved
      // Note: Because we mostly used @/ aliases, we might be fine.
      // But let's check for standard relative paths that broke:
      // For instance, inside features/home/components/Hero.tsx, it might have imported from `../data/hero.json`.
      // It was in `src/components/Hero.tsx` so it was `../data/hero.json`.
      // Now it's in `src/features/home/components/Hero.tsx` so it should be `../data/hero.json`. That is identical!
      // But if it was `../../data`, etc. Let's fix relative to absolute where possible, or let TypeScript catch them.
      
      if (modified) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

processDirectory(srcDir);
console.log('Done.');
