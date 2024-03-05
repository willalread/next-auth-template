import {
  CheckCircledIcon,
  ExclamationTriangleIcon,
} from "@radix-ui/react-icons"

export function ErrorMessage({ message }: { message?: string }) {
  if (!message) return null

  return (
    <div className="flex items-center gap-2 rounded-sm bg-destructive/15 p-3 text-sm text-destructive">
      <ExclamationTriangleIcon className="h-4 w-4" />
      <p>{message}</p>
    </div>
  )
}

export function SuccessMessage({ message }: { message?: string }) {
  if (!message) return null

  return (
    <div className="flex items-center gap-2 rounded-sm bg-emerald-500/15 p-3 text-sm text-emerald-500">
      <CheckCircledIcon className="h-4 w-4" />
      <p>{message}</p>
    </div>
  )
}
