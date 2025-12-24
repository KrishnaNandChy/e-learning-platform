# Component Guide

A comprehensive guide to using the UI components in the EduLearn platform.

## Table of Contents

- [Button](#button)
- [Input](#input)
- [Card](#card)
- [Badge](#badge)
- [ProgressBar](#progressbar)
- [Avatar](#avatar)
- [Rating](#rating)
- [Modal](#modal)

---

## Button

Versatile button component with multiple variants and sizes.

### Import

```javascript
import { Button } from '../components/ui';
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | ReactNode | - | Button content |
| `variant` | string | 'primary' | Button style variant |
| `size` | string | 'md' | Button size |
| `disabled` | boolean | false | Disable button |
| `loading` | boolean | false | Show loading state |
| `icon` | ReactNode | - | Icon element |
| `iconPosition` | string | 'left' | Icon position |
| `fullWidth` | boolean | false | Full width button |
| `onClick` | function | - | Click handler |
| `type` | string | 'button' | Button type |

### Variants

- `primary` - Main action button (blue)
- `secondary` - Secondary action (gray)
- `outline` - Outlined button
- `ghost` - Transparent button
- `success` - Success action (green)
- `danger` - Destructive action (red)

### Sizes

- `sm` - Small button
- `md` - Medium button (default)
- `lg` - Large button

### Examples

```jsx
// Primary button
<Button variant="primary">
  Click Me
</Button>

// Loading button
<Button variant="primary" loading>
  Loading...
</Button>

// Button with icon
<Button 
  variant="primary" 
  icon={<svg>...</svg>}
  iconPosition="left"
>
  Save
</Button>

// Full width button
<Button variant="primary" fullWidth>
  Submit
</Button>

// Disabled button
<Button variant="primary" disabled>
  Disabled
</Button>
```

---

## Input

Form input component with label, validation, and icons.

### Import

```javascript
import { Input } from '../components/ui';
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | string | - | Input label |
| `type` | string | 'text' | Input type |
| `placeholder` | string | - | Placeholder text |
| `value` | string | - | Input value |
| `onChange` | function | - | Change handler |
| `error` | string | - | Error message |
| `success` | string | - | Success message |
| `helperText` | string | - | Helper text |
| `icon` | ReactNode | - | Icon element |
| `iconPosition` | string | 'left' | Icon position |
| `disabled` | boolean | false | Disable input |
| `required` | boolean | false | Required field |

### Examples

```jsx
// Basic input
<Input
  label="Email Address"
  type="email"
  placeholder="you@example.com"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>

// Input with error
<Input
  label="Password"
  type="password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  error="Password is required"
  required
/>

// Input with icon
<Input
  label="Search"
  type="text"
  placeholder="Search courses..."
  icon={<SearchIcon />}
  iconPosition="left"
/>

// Input with helper text
<Input
  label="Username"
  type="text"
  helperText="Choose a unique username"
/>
```

---

## Card

Flexible card container component.

### Import

```javascript
import { Card } from '../components/ui';
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | ReactNode | - | Card content |
| `className` | string | '' | Additional classes |
| `hover` | boolean | false | Hover effect |
| `onClick` | function | - | Click handler |

### Sub-components

- `Card.Header` - Card header section
- `Card.Body` - Card body section
- `Card.Footer` - Card footer section

### Examples

```jsx
// Basic card
<Card>
  <Card.Body>
    Content here
  </Card.Body>
</Card>

// Card with all sections
<Card>
  <Card.Header>
    <h3>Card Title</h3>
  </Card.Header>
  <Card.Body>
    Main content
  </Card.Body>
  <Card.Footer>
    Footer content
  </Card.Footer>
</Card>

// Hoverable card
<Card hover onClick={() => console.log('clicked')}>
  <Card.Body>
    Click me
  </Card.Body>
</Card>
```

---

## Badge

Status indicator component.

### Import

```javascript
import { Badge } from '../components/ui';
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | ReactNode | - | Badge content |
| `variant` | string | 'primary' | Badge color variant |
| `size` | string | 'md' | Badge size |
| `icon` | ReactNode | - | Icon element |

### Variants

- `primary` - Primary badge (blue)
- `success` - Success badge (green)
- `warning` - Warning badge (yellow)
- `danger` - Danger badge (red)
- `secondary` - Secondary badge (gray)

### Sizes

- `sm` - Small badge
- `md` - Medium badge (default)
- `lg` - Large badge

### Examples

```jsx
// Basic badges
<Badge variant="primary">New</Badge>
<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="danger">Error</Badge>

// Badge with icon
<Badge variant="success" icon={<CheckIcon />}>
  Completed
</Badge>

// Different sizes
<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>
<Badge size="lg">Large</Badge>
```

---

## ProgressBar

Visual progress indicator.

### Import

```javascript
import { ProgressBar } from '../components/ui';
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | number | 0 | Current progress value |
| `max` | number | 100 | Maximum value |
| `showLabel` | boolean | true | Show percentage label |
| `color` | string | 'primary' | Progress bar color |
| `size` | string | 'md' | Bar height |

### Colors

- `primary` - Blue gradient
- `success` - Green gradient
- `warning` - Yellow gradient
- `danger` - Red gradient

### Sizes

- `sm` - Thin bar (4px)
- `md` - Medium bar (8px)
- `lg` - Thick bar (12px)

### Examples

```jsx
// Basic progress bar
<ProgressBar value={65} />

// Without label
<ProgressBar value={45} showLabel={false} />

// Different colors
<ProgressBar value={80} color="success" />
<ProgressBar value={30} color="warning" />
<ProgressBar value={15} color="danger" />

// Different sizes
<ProgressBar value={65} size="sm" />
<ProgressBar value={65} size="lg" />

// Custom max value
<ProgressBar value={7} max={10} />
```

---

## Avatar

User avatar component with fallback.

### Import

```javascript
import { Avatar } from '../components/ui';
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | string | - | Image source URL |
| `alt` | string | 'Avatar' | Alt text |
| `size` | string | 'md' | Avatar size |
| `fallback` | string | - | Fallback text |

### Sizes

- `sm` - Small (32px)
- `md` - Medium (48px)
- `lg` - Large (64px)
- `xl` - Extra large (96px)

### Examples

```jsx
// Basic avatar
<Avatar 
  src="https://example.com/avatar.jpg" 
  alt="John Doe"
  size="md"
/>

// Avatar with fallback
<Avatar 
  src={null}
  alt="John Doe"
  fallback="JD"
  size="lg"
/>

// Different sizes
<Avatar src="..." size="sm" />
<Avatar src="..." size="md" />
<Avatar src="..." size="lg" />
<Avatar src="..." size="xl" />
```

---

## Rating

Star rating display component.

### Import

```javascript
import { Rating } from '../components/ui';
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | number | 0 | Rating value |
| `max` | number | 5 | Maximum stars |
| `showValue` | boolean | true | Show numeric value |
| `size` | string | 'md' | Rating size |
| `count` | number | - | Review count |

### Sizes

- `sm` - Small stars
- `md` - Medium stars (default)
- `lg` - Large stars

### Examples

```jsx
// Basic rating
<Rating value={4.5} />

// Rating without value
<Rating value={4.8} showValue={false} />

// Rating with review count
<Rating value={4.7} count={1234} />

// Different sizes
<Rating value={4.5} size="sm" />
<Rating value={4.5} size="lg" />

// Custom max stars
<Rating value={4} max={10} />
```

---

## Modal

Overlay modal dialog component.

### Import

```javascript
import { Modal } from '../components/ui';
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | boolean | - | Modal open state |
| `onClose` | function | - | Close handler |
| `children` | ReactNode | - | Modal content |
| `title` | string | - | Modal title |
| `size` | string | 'md' | Modal size |

### Sizes

- `sm` - Small modal
- `md` - Medium modal (default)
- `lg` - Large modal
- `xl` - Extra large modal
- `full` - Full width modal

### Examples

```jsx
// Basic modal
const [isOpen, setIsOpen] = useState(false);

<Modal 
  isOpen={isOpen} 
  onClose={() => setIsOpen(false)}
  title="Modal Title"
>
  <p>Modal content here</p>
</Modal>

// Large modal
<Modal 
  isOpen={isOpen} 
  onClose={() => setIsOpen(false)}
  title="Large Modal"
  size="lg"
>
  <p>Content here</p>
</Modal>

// Modal with form
<Modal 
  isOpen={isOpen} 
  onClose={() => setIsOpen(false)}
  title="Edit Profile"
>
  <form>
    <Input label="Name" />
    <Input label="Email" type="email" />
    <Button type="submit">Save</Button>
  </form>
</Modal>
```

---

## Best Practices

### 1. Consistent Styling

Use the design system's predefined variants and sizes for consistency:

```jsx
// ✅ Good
<Button variant="primary" size="lg">Submit</Button>

// ❌ Avoid custom inline styles
<button style={{ backgroundColor: 'blue' }}>Submit</button>
```

### 2. Accessibility

Always provide meaningful labels and alt text:

```jsx
// ✅ Good
<Input label="Email Address" type="email" required />
<Avatar src="..." alt="John Doe" />

// ❌ Missing accessibility
<input type="email" />
<img src="..." />
```

### 3. Error Handling

Display clear error messages:

```jsx
<Input
  label="Password"
  type="password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  error={errors.password}
  required
/>
```

### 4. Loading States

Show loading indicators for async actions:

```jsx
<Button 
  variant="primary" 
  loading={isSubmitting}
  disabled={isSubmitting}
>
  {isSubmitting ? 'Saving...' : 'Save'}
</Button>
```

### 5. Responsive Design

Consider mobile users:

```jsx
// Use fullWidth on mobile
<Button 
  variant="primary" 
  fullWidth 
  className="md:w-auto"
>
  Submit
</Button>
```

---

## Extending Components

You can extend components with additional styles:

```jsx
<Button 
  variant="primary" 
  className="shadow-lg transform hover:scale-105"
>
  Enhanced Button
</Button>
```

Or create custom variants:

```jsx
<Card className="border-2 border-primary-500">
  <Card.Body>
    Custom styled card
  </Card.Body>
</Card>
```

---

## Need Help?

- Check component implementation in `src/components/ui/`
- Review usage in existing pages
- See Tailwind CSS docs for styling: https://tailwindcss.com
- Open an issue for bugs or feature requests
