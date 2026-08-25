---
trigger: always_on
---

# Antigravity Agent Instructions

When working in this repository, please strictly adhere to the following rules and conventions:

## 1. Naming Conventions (Strictly Enforced)
- **Interfaces**: All TypeScript interfaces MUST start with an uppercase `I` prefix (e.g., `IUser`, `IApiResponse`, `ICanProps`).
- **Type Aliases**: All TypeScript type aliases MUST start with an uppercase `T` prefix (e.g., `TUserFields`, `TModalType`, `TAppDispatch`).
*Note: This is strictly enforced by our ESLint `@typescript-eslint/naming-convention` rules.*

## 2. Tech Stack & Libraries
- **Framework**: React Native with Expo (using Expo Router for navigation).
- **Styling**: NativeWind (Tailwind CSS for React Native).
- **State Management**: Redux Toolkit (RTK) & RTK Query for all API interactions.
- **Forms**: `react-hook-form` paired with `@hookform/resolvers/zod` for validation.
- **Icons**: `react-native-vector-icons`.

## 3. Project Structure
- `app/`: Contains Expo Router pages, layouts, and route definitions.
- `src/components/common/`: Reusable, generic UI components (e.g., `AppButton`, `AppText`, `AppCard`).
- `src/components/form/`: Form-specific components meant to be used with `react-hook-form` (e.g., `AppInput`, `AppPasswordInput`, `AppSelect`).
- `src/schemas/`: Zod validation schemas (e.g., `admin.schema.ts`, `auth.schema.ts`).
- `src/types/`: Centralized TypeScript definitions (e.g., `admin.type.ts`).
- `src/store/api/`: RTK Query endpoint definitions and API splits.

## 4. General Development Guidelines
- **Component Reuse**: Always prioritize using existing generic components from `src/components/common/` and `src/components/form/` before creating new ones.
- **Form Handling**: Always use `useForm` from `react-hook-form` and define schemas using `zod`. Do not use basic state variables (`useState`) for complex form tracking.
- **API Calls**: Leverage RTK Query mutations and queries from `src/store/api/`. Do not use raw `fetch` or `axios` calls directly in components unless absolutely necessary.
- **Exports**: Ensure types and schemas are exported from their respective `index.ts` barrel files for clean imports (e.g., `import { TCreateAdminFields } from "@/src/types";`).
