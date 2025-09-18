## Sparkbook Design Guide

## 🎨 Brand Color System

### Primary: Magic Gradient
- **Hex Values**: `#ee4cff` → `#ff6b6b` → `#4ecdc4`
- **Usage**: CTA buttons, main headlines, key interactive elements
- **Classes**: `.magic-gradient`, `.sparkle-text`
- **Typography**: Apply to h1, h2, and primary buttons only

### Secondary: Soft Pastels
- **Magic 200**: `#fcd9ff` (card backgrounds)
- **Magic 50**: `#fef7ff` (section backgrounds)
- **Usage**: Backgrounds, subtle accents, glass effects
- **Classes**: `.bg-soft-pastel`, `.glass-effect`

### Accent Colors
- **Yellow**: `#facc15` (stars, highlights)
- **Green**: `#22c55e` (trust signals, success states)
- **Usage**: Icons, badges, positive feedback

## 📝 Typography System

### Font Sizes (Mobile → Desktop)
- **H1**: `text-2xl sm:text-3xl lg:text-6xl` (hero headlines)
- **H2**: `text-xl sm:text-2xl lg:text-4xl` (section titles)
- **H3**: `text-lg sm:text-xl lg:text-3xl` (subsection titles)
- **Body**: `text-base sm:text-lg` (main content)
- **Small**: `text-sm sm:text-base` (supporting text)
- **Caption**: `text-xs sm:text-sm` (fine print)

### Line Heights
- **Tight**: `leading-[0.8]` (hero headlines only)
- **Normal**: `leading-[1.1]` (body text)
- **Relaxed**: `leading-relaxed` (long paragraphs)

### Font Weights
- **Bold**: `font-bold` (headlines, CTAs)
- **Semibold**: `font-semibold` (buttons, emphasis)
- **Medium**: `font-medium` (labels, navigation)
- **Normal**: `font-normal` (body text)

## 🧩 UI Component System

### Component Library: shadcn/ui
- **Base**: All components use shadcn/ui as foundation
- **Customization**: Apply brand colors and effects on top
- **Consistency**: Maintain shadcn/ui spacing and sizing patterns

### Button Specifications
- **Primary**: `magic-gradient` background, `text-white`, `px-4 py-4 sm:px-8 sm:py-6`
- **Secondary**: `border-2`, `border-magic-300`, `text-magic-600`, `hover:bg-magic-50`
- **Size**: `h-auto` with responsive padding
- **Radius**: `rounded-xl` (2xl for special cases)

### Card Specifications
- **Background**: `glass-effect` or `bg-white/80`
- **Padding**: `p-4 sm:p-6` (responsive)
- **Radius**: `rounded-2xl` (standard), `rounded-3xl` (hero elements)
- **Shadow**: `shadow-soft` (subtle), `shadow-lg` (elevated)

### Spacing System
- **Section Padding**: `py-16 sm:py-20 lg:py-24`
- **Container**: `max-w-7xl mx-auto px-6 lg:px-8`
- **Element Gaps**: `gap-4 sm:gap-6 lg:gap-8`
- **Text Spacing**: `mb-4 sm:mb-6` (paragraphs), `mb-8 sm:mb-12` (sections)

## 🎯 Interaction Effects

### Hover States
- **Lift**: `hover-lift` (gentle transform: translateY(-2px))
- **Glow**: `hover-glow` (magic gradient shadow)
- **Scale**: `hover:scale-105` (subtle growth on interactive elements)

### Animations
- **Sparkle**: `animate-sparkle` (rotating sparkle icons)
- **Float**: `animate-float` (gentle up/down movement)
- **Pulse**: `animate-pulse` (breathing effect for loading states)

## 📱 Responsive Breakpoints

### Mobile First Approach
- **Mobile**: `< 640px` (default styles)
- **Tablet**: `sm: 640px+` (small adjustments)
- **Desktop**: `lg: 1024px+` (full layout)

### Key Responsive Patterns
- **Text**: Always start small, scale up (`text-base sm:text-lg lg:text-xl`)
- **Spacing**: Increase on larger screens (`p-4 sm:p-6 lg:p-8`)
- **Layout**: Stack on mobile, side-by-side on desktop (`flex-col lg:flex-row`)

## ⚡ Quick Reference

### Essential Classes
```css
/* Brand Colors */
.magic-gradient     /* Primary CTA background */
.sparkle-text       /* Gradient text for headlines */
.bg-soft-pastel     /* Section backgrounds */
.glass-effect       /* Card backgrounds */

/* Typography */
.text-2xl.sm:text-3xl.lg:text-6xl  /* Hero headlines */
.text-base.sm:text-lg               /* Body text */
.leading-[0.8]                      /* Tight line height */

/* Spacing */
.p-4.sm:p-6                        /* Card padding */
.py-16.sm:py-20.lg:py-24           /* Section padding */
.gap-4.sm:gap-6.lg:gap-8           /* Element gaps */

/* Interactions */
.hover-lift         /* Gentle lift on hover */
.hover-glow         /* Magic glow effect */
.rounded-2xl        /* Standard border radius */
```

### Component Rules
1. **All buttons**: Use shadcn/ui base + brand colors
2. **All cards**: `glass-effect` + responsive padding
3. **All text**: Mobile-first responsive sizing
4. **All spacing**: Consistent gap/padding system
5. **All interactions**: Subtle hover effects only

### Brand Voice
- **Magic**: Sparkle effects and gradients for wonder
- **Warmth**: Soft pastels for comfort and safety  
- **Trust**: Clean glass effects for professionalism
- **Joy**: Bright accents for positive energy