"use client"

import { useState, useTransition } from "react"
import { useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { resetPassword } from "@/lib/actions/reset-password"
import { resetPasswordSchema, type ResetPasswordSchema } from "@/lib/schemas"
import { CardWrapper } from "@/components/auth/card-wrapper"
import { ErrorMessage, SuccessMessage } from "@/components/status-message"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

export function ResetPasswordForm() {
  const [success, setSuccess] = useState<string | undefined>()
  const [error, setError] = useState<string | undefined>()
  const [isPending, startTransition] = useTransition()

  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const form = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
    },
  })

  function handleSubmit(values: ResetPasswordSchema) {
    setError(undefined)
    setSuccess(undefined)

    startTransition(() => {
      resetPassword(values, token)
        .then((data) => {
          setSuccess(data.success)
          setError(data.error)
        })
        .catch(() => {
          setError("Something went wrong.")
        })
    })
  }

  return (
    <CardWrapper
      description="Reset your password"
      backButton={{
        href: "/auth/login",
        label: "Back to login",
      }}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    placeholder="********"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <SuccessMessage message={success} />
          {!success && <ErrorMessage message={error} />}
          <Button disabled={isPending} type="submit" className="w-full">
            Reset password
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
