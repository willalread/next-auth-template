"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { register } from "@/lib/actions/register"
import { registerSchema, type RegisterSchema } from "@/lib/schemas"
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

export function RegisterForm() {
  const [success, setSuccess] = useState<string | undefined>()
  const [error, setError] = useState<string | undefined>()
  const [isPending, startTransition] = useTransition()

  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  function handleSubmit(values: RegisterSchema) {
    setSuccess(undefined)
    setError(undefined)

    startTransition(() => {
      register(values)
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
      description="Create an account"
      backButton={{
        href: "/auth/login",
        label: "Already have an account?",
      }}
      showSocials
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="John Doe"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
          </div>
          <SuccessMessage message={success} />
          {!success && <ErrorMessage message={error} />}
          <Button disabled={isPending} type="submit" className="w-full">
            Register
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
