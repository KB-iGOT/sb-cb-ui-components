# Dynamic Sidebar Navigation System

A highly reusable, enterprise-ready left sidebar navigation component built with Angular 20, Material Design, and Tailwind CSS.

## 📋 Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Components](#components)
- [Best Practices](#best-practices)
- [Customization](#customization)
- [Accessibility](#accessibility)

## ✨ Features

- **Fully Configurable**: Drive entire sidebar from a single configuration object
- **Dynamic Section Types**: Support for nav lists, stat cards, and info cards
- **Collapsible Sidebar**: Smooth animations with open/close toggle
- **Collapsible Sections**: Optional section-level collapsing
- **Nested Navigation**: Support for nested children in info cards
- **Active Route Highlighting**: Automatic active state based on current route
- **Responsive Design**: Mobile-first with overlay on mobile devices
- **Material Design**: Integrated with Angular Material components
- **Tailwind Styling**: Utility-first CSS with customizable classes
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- **Performance Optimized**: OnPush change detection, signal-based state
- **Type Safe**: Complete TypeScript interfaces and enums

## 🏗️ Architecture

### Component Hierarchy

```
DynamicSidebarComponent (Parent)
├── SidebarNavListSectionComponent (Navigation items)
├── SidebarStatCardsSectionComponent (Achievement/stat cards)
└── SidebarInfoCardsSectionComponent (Info cards with nested children)
```

### Why This Architecture?

1. **Separation of Concerns**: Each section type has its own component with specific rendering logic
2. **Easy Extension**: Add new card types by creating new components without modifying existing ones
3. **Reusability**: Each child component can be used independently if needed
4. **Maintainability**: Clear component boundaries make debugging and updates easier
5. **Scalability**: New features can be added to specific sections without affecting others

### Design Patterns Used

- **Strategy Pattern**: Different rendering strategies for different card types
- **Component Composition**: Parent delegates to specialized children
- **Signal-based State**: Modern Angular signals for reactive state management
- **OnPush Change Detection**: Optimized performance
- **Standalone Components**: No NgModule dependencies

## 📦 Installation

### Prerequisites

- Angular 20+
- Angular Material
- Tailwind CSS

### Step 1: Import Required Material Modules

Ensure these Material modules are available (already done in standalone components):

- `MatIconModule`
- `MatButtonModule`
- `MatExpansionModule`
- `MatRippleModule`

### Step 2: Configure Tailwind CSS

Ensure your `tailwind.config.js` includes the component paths:

```javascript
module.exports = {
  content: [
    "./library/**/*.{html,ts}",
    // ... other paths
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### Step 3: Import Component

Since all components are standalone, simply import the parent component:

```typescript
import { DynamicSidebarComponent } from './path/to/left_nav_bar/components/dynamic-sidebar/dynamic-sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DynamicSidebarComponent],
  template: `
    <app-dynamic-sidebar [menuBarDetails]="sidebarConfig" />
  `
})
export class AppComponent {
  // ... component code
}
```

## 🚀 Usage

### Basic Example

```typescript
import { Component } from '@angular/core';
import { DynamicSidebarComponent } from './path/to/dynamic-sidebar/dynamic-sidebar.component';
import { SidebarConfig, SidebarCardType } from './path/to/models/sidebar.models';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DynamicSidebarComponent],
  template: `
    <app-dynamic-sidebar [menuBarDetails]="sidebarConfig" />
    <main class="ml-0 md:ml-[280px] transition-all duration-300">
      <router-outlet />
    </main>
  `
})
export class AppComponent {
  sidebarConfig: SidebarConfig = {
    logoUrl: 'assets/logo.png',
    headerText: 'My App',
    defaultOpen: true,
    navSections: [
      {
        cardType: SidebarCardType.NAV_LIST,
        sectionTitle: '',
        collapsible: false,
        showViewAll: false,
        items: [
          {
            iconName: 'home',
            label: 'Home',
            navUrl: '/home'
          },
          {
            iconName: 'explore',
            label: 'Explore',
            navUrl: '/explore'
          }
        ]
      }
    ]
  };
}
```

### Example with Layout Adjustment (Recommended)

To prevent sidebar from overlapping content, use the `sidebarStateChange` event:

```typescript
import { Component, signal } from '@angular/core';
import { DynamicSidebarComponent } from './path/to/dynamic-sidebar/dynamic-sidebar.component';
import { SidebarConfig, SidebarStateChange } from './path/to/models/sidebar.models';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DynamicSidebarComponent],
  template: `
    <app-dynamic-sidebar
      [menuBarDetails]="sidebarConfig"
      (sidebarStateChange)="onSidebarStateChange($event)" />

    <main [style.margin-left.px]="sidebarWidth()">
      <router-outlet />
    </main>
  `,
  styles: [`
    main {
      min-height: 100vh;
      transition: margin-left 300ms cubic-bezier(0.4, 0.0, 0.2, 1);
      background-color: #f7fafc;
    }
  `]
})
export class AppComponent {
  sidebarConfig: SidebarConfig = { /* ... */ };

  // Track sidebar width for dynamic layout
  sidebarWidth = signal<number>(280);

  /**
   * Handle sidebar state changes
   * @param state - Contains isOpen status and current width
   */
  onSidebarStateChange(state: SidebarStateChange): void {
    this.sidebarWidth.set(state.width);
    // state.isOpen: true (expanded 280px) or false (collapsed 64px)
    // state.width: 280 or 64
  }
}
```

**Output Event Interface:**

```typescript
interface SidebarStateChange {
  isOpen: boolean;  // true = expanded, false = collapsed
  width: number;    // 280 (expanded) or 64 (collapsed)
}
```

### Advanced Example with All Section Types

See `mock-data/sidebar-mock-data.ts` for a complete example including:
- Navigation list items
- Achievement stat cards with "View All"
- Info cards with nested children

## ⚙️ Configuration

### SidebarConfig Interface

```typescript
interface SidebarConfig {
  logoUrl?: string;              // Optional logo image URL
  headerText?: string;           // Optional header text
  defaultOpen: boolean;          // Initial open/close state
  navSections: SidebarSection[]; // Array of sections
}
```

### Section Types

#### 1. Nav List Section (NAV_LIST)

For standard navigation menu items.

```typescript
{
  cardType: SidebarCardType.NAV_LIST,
  sectionTitle: 'Navigation',
  collapsible: false,
  showViewAll: false,
  items: [
    {
      iconName: 'home',      // Material icon name
      iconUrl: '',           // Or custom icon URL
      label: 'Home',
      navUrl: '/home'
    }
  ]
}
```

#### 2. Stat Cards Section (STAT_CARDS)

For achievements, rankings, and statistics.

```typescript
{
  cardType: SidebarCardType.STAT_CARDS,
  sectionTitle: 'My Achievements',
  collapsible: true,
  showViewAll: true,
  viewAllLabel: 'View all achievements',
  maxItemsVisible: 3,
  items: [
    {
      iconName: 'military_tech',
      headerLabel: "You're now standing at",
      value: '7th Rank',
      navUrl: '/achievements/rank'
    }
  ]
}
```

#### 3. Info Cards Section (INFO_CARDS)

For informational cards with optional nested children.

```typescript
{
  cardType: SidebarCardType.INFO_CARDS,
  sectionTitle: 'Quick Actions',
  collapsible: true,
  showViewAll: false,
  items: [
    // Simple card
    {
      hasChildren: false,
      iconName: 'help_center',
      title: 'Help Centre',
      description: 'Need help?',
      navUrl: '/help'
    },
    // Card with children
    {
      hasChildren: true,
      iconName: 'apps',
      title: 'Other Portals',
      description: '',
      navUrl: '',
      children: [
        {
          iconName: 'admin_panel_settings',
          title: 'Admin Portal',
          description: 'Manage users',
          navUrl: '/admin'
        }
      ]
    }
  ]
}
```

## 🔧 Components

### DynamicSidebarComponent

**Responsibility**: Main container, toggle logic, section routing

**Key Features**:
- Sidebar open/close animation
- Header rendering (logo + text)
- Dynamic section type switching
- Mobile overlay
- Signal-based state management

### SidebarNavListSectionComponent

**Responsibility**: Render navigation menu items

**Key Features**:
- Active route highlighting
- Material icons + custom images
- Hover effects with ripple
- Keyboard navigation

### SidebarStatCardsSectionComponent

**Responsibility**: Render achievement/stat cards

**Key Features**:
- Card-based layout
- "View All" with maxItemsVisible
- Computed signals for visibility
- Gradient backgrounds
- Optional section collapsing

### SidebarInfoCardsSectionComponent

**Responsibility**: Render info cards with nested children

**Key Features**:
- Parent-child card structure
- Expandable nested items
- Material accordion support
- Independent child expansion state

## 📚 Best Practices

### 1. Type Safety

Always use provided interfaces:

```typescript
import { SidebarConfig, SidebarCardType } from './models/sidebar.models';

const config: SidebarConfig = { /* ... */ };
```

### 2. Performance

- Use `trackBy` functions (already implemented)
- Keep configuration objects in component properties
- Avoid frequent config changes

### 3. Responsive Design

Adjust main content margin based on sidebar state:

```css
.main-content {
  margin-left: 0;
  transition: margin-left 300ms;
}

@media (min-width: 768px) {
  .main-content {
    margin-left: 280px;
  }
}
```

### 4. Icon Strategy

Choose between Material icons and custom images:

```typescript
// Material icon (preferred for standard icons)
{ iconName: 'home', iconUrl: '' }

// Custom image
{ iconName: '', iconUrl: 'assets/custom-icon.svg' }
```

## 🎨 Customization

### Colors

Modify Tailwind classes in component templates or extend theme:

```javascript
// tailwind.config.js
theme: {
  extend: {
    colors: {
      primary: '#your-color',
    }
  }
}
```

### Sidebar Width

Update constants in `constants/sidebar.constants.ts`:

```typescript
export const SIDEBAR_WIDTH = {
  EXPANDED: '320px', // Changed from 280px
  COLLAPSED: '0px',
  MOBILE_EXPANDED: '100vw'
} as const;
```

### Animations

Modify animation settings in `constants/sidebar.constants.ts`:

```typescript
export const SIDEBAR_ANIMATION = {
  DURATION: '400ms',  // Slower animation
  EASING: 'ease-in-out'
} as const;
```

## ♿ Accessibility

### Features Implemented

- ARIA labels on all interactive elements
- `aria-expanded` states for collapsible items
- `role="navigation"` on sidebar
- `role="menuitem"` on nav links
- Keyboard navigation support
- Focus-visible styles
- Screen reader friendly structure
- Reduced motion support

### Testing Accessibility

```bash
# Use axe DevTools or similar
# Check keyboard navigation
# Test with screen readers (NVDA, JAWS, VoiceOver)
```

## 🧪 Testing Example

```typescript
describe('DynamicSidebarComponent', () => {
  it('should render navigation items', () => {
    const config: SidebarConfig = {
      defaultOpen: true,
      navSections: [
        {
          cardType: SidebarCardType.NAV_LIST,
          items: [{ iconName: 'home', label: 'Home', navUrl: '/home' }]
        }
      ]
    };
    // ... test implementation
  });
});
```

## 📂 Folder Structure

```
left_nav_bar/
├── components/
│   ├── dynamic-sidebar/
│   │   ├── dynamic-sidebar.component.ts
│   │   ├── dynamic-sidebar.component.html
│   │   └── dynamic-sidebar.component.scss
│   ├── sidebar-nav-list-section/
│   │   ├── sidebar-nav-list-section.component.ts
│   │   ├── sidebar-nav-list-section.component.html
│   │   └── sidebar-nav-list-section.component.scss
│   ├── sidebar-stat-cards-section/
│   │   ├── sidebar-stat-cards-section.component.ts
│   │   ├── sidebar-stat-cards-section.component.html
│   │   └── sidebar-stat-cards-section.component.scss
│   └── sidebar-info-cards-section/
│       ├── sidebar-info-cards-section.component.ts
│       ├── sidebar-info-cards-section.component.html
│       └── sidebar-info-cards-section.component.scss
├── models/
│   └── sidebar.models.ts
├── constants/
│   └── sidebar.constants.ts
├── mock-data/
│   └── sidebar-mock-data.ts
└── README.md
```

## 🔄 Adding New Card Types

To add a new card type (e.g., `CHART_CARDS`):

1. Add enum value in `models/sidebar.models.ts`
2. Create new interface extending `BaseSectionConfig`
3. Add to `SidebarSection` union type
4. Create new child component
5. Import in parent component
6. Add `@if` block in parent template

## 🤝 Contributing

When adding features:
- Follow Angular 20 best practices
- Use standalone components only
- Maintain TypeScript strict mode
- Add proper documentation
- Update this README

## 📝 License

[Your License Here]

## 👥 Credits

Built with Angular 20, Material Design, and Tailwind CSS.

---

**Questions or Issues?** Please refer to the example mock data and usage patterns above.
