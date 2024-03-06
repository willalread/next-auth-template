import {
  CheckCircledIcon,
  ExclamationTriangleIcon,
} from "@radix-ui/react-icons"

export function ErrorMessage({ message }: { message?: string }) {
  if (!message) return null

  return (
    <div className="flex items-center gap-2 overflow-hidden rounded-md bg-red-500/15 p-3 text-sm text-red-500">
      <ExclamationTriangleIcon className="h-4 w-4" />
      <p>{message}</p>
    </div>
  )
}

export function SuccessMessage({ message }: { message?: string }) {
  if (!message) return null

  return (
    <div className="flex items-center gap-2 overflow-hidden rounded-md bg-emerald-500/15 p-3 text-sm text-emerald-500">
      <CheckCircledIcon className="h-4 w-4" />
      <p>{message}</p>
    </div>
  )
}
