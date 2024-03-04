"use client"

import { useState, useTransition } from "react"
import { useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { resetPassword } from "@/lib/actions/reset-password"
import { resetPasswordSchema, type ResetPasswordSchema } from "@/lib/schemas"
import { CardWrapper } from "@/components/auth/card-wrapper"
import { FormError, FormSuccess } from "@/components/form-status"
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
  const [error, setError] = useState<string | undefined>()
  const [success, setSuccess] = useState<string | undefined>()
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
        .then((result) => {
          setSuccess(result.success)
          setError(result.error)
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
          <FormSuccess message={success} />
          {!success && <FormError message={error} />}
          <Button disabled={isPending} type="submit" className="w-full">
            Reset password
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
