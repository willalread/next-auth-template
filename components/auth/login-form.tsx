"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { login } from "@/lib/actions/login"
import { loginSchema, type LoginSchema } from "@/lib/schemas"
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

export function LoginForm() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl")
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with a different provider."
      : undefined

  const [errorMessage, setErrorMessage] = useState<string | undefined>()
  const [successMessage, setSuccessMessage] = useState<string | undefined>()
  const [isPending, startTransition] = useTransition()

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  function handleSubmit(values: LoginSchema) {
    setErrorMessage(undefined)
    setSuccessMessage(undefined)

    startTransition(() => {
      login(values, callbackUrl).then((result) => {
        setErrorMessage(result?.error)
        setSuccessMessage(result?.success)
      })
    })
  }

  return (
    <CardWrapper
      description="Welcome back"
      backButton={{
        href: "/auth/register",
        label: "Don't have an account?",
      }}
      showSocials
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="space-y-4">
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
                  <Button
                    variant="link"
                    size="sm"
                    asChild
                    className="px-0 font-normal"
                  >
                    <Link href="/auth/forgot-password">Forgot password?</Link>
                  </Button>
                </FormItem>
              )}
            />
          </div>
          <FormError message={errorMessage || urlError} />
          <FormSuccess message={successMessage} />
          <Button disabled={isPending} type="submit" className="w-full">
            Login
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
