"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { forgotPassword } from "@/lib/actions/forgot-password"
import { forgotPasswordSchema, type ForgotPasswordSchema } from "@/lib/schemas"
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

export function ForgotPasswordForm() {
  const [error, setError] = useState<string | undefined>()
  const [success, setSuccess] = useState<string | undefined>()
  const [isPending, startTransition] = useTransition()

  const form = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  function handleSubmit(values: ForgotPasswordSchema) {
    setError(undefined)
    setSuccess(undefined)

    startTransition(() => {
      forgotPassword(values)
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
      description="Forgot your password?"
      backButton={{
        href: "/auth/login",
        label: "Back to login",
      }}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    placeholder="john.doe@example.com"
                    type="email"
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
            Send reset email
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
