"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { login } from "@/lib/actions/login"
import { loginSchema, type LoginSchema } from "@/lib/schemas"
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

export function LoginForm() {
  const [success, setSuccess] = useState<string | undefined>()
  const [error, setError] = useState<string | undefined>()
  const [showTwoFactor, setShowTwoFactor] = useState(false)
  const [isPending, startTransition] = useTransition()

  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl")
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with a different provider."
      : undefined

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      code: undefined,
    },
  })

  function handleSubmit(values: LoginSchema) {
    setSuccess(undefined)
    setError(undefined)

    startTransition(() => {
      login(values, callbackUrl)
        .then((data) => {
          setSuccess(data?.success)
          setError(data?.error)

          if (data?.twoFactor) {
            setShowTwoFactor(data.twoFactor)
            form.setValue("code", "")
          }
        })
        .catch(() => {
          setError("Something went wrong.")
        })
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {showTwoFactor ? (
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <div className="flex flex-col items-center">
                <FormItem>
                  <FormLabel>MFA Code</FormLabel>
                  <FormControl>
                    <InputOTP
                      disabled={isPending}
                      maxLength={6}
                      onComplete={form.handleSubmit(handleSubmit)}
                      render={({ slots }) => (
                        <InputOTPGroup>
                          {slots.map((slot, index) => (
                            <InputOTPSlot key={index} {...slot} />
                          ))}{" "}
                        </InputOTPGroup>
                      )}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </div>
            )}
          />
        ) : (
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
        )}
        <SuccessMessage message={success} />
        {!success && <ErrorMessage message={error || urlError} />}
        {!showTwoFactor && (
          <Button disabled={isPending} type="submit" className="w-full">
            Login
          </Button>
        )}
      </form>
    </Form>
  )
}
