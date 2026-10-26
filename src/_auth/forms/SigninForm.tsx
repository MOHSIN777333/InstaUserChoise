import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { SigninValidation } from "@/lib/Validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { cn } from "cn";
import { Link, useNavigate } from "react-router-dom";
import { Aperture, Eye, EyeOff, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useSignInAccount } from "@/lib/react-query/queries";
import { toast } from "@/components/ui/toast";

type signInValue = z.infer<typeof SigninValidation>;

const SigninForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { mutateAsync: signInAccount } = useSignInAccount();
  const navigate = useNavigate();
  const isSubmitting = false;
  const form = useForm<signInValue>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: signInValue) => {
    try {
      const session = await signInAccount({
        email: values.email,
        password: values.password,
      });

      if (!session) {
        toast.add({
          type: "error",
          title: "Account created",
          description: "Please try Again sign in your Account.",
        });

        return;
      }

      navigate("/sign-in", { replace: true });
    } catch (error) {
      console.error("error ::", error);
      toast.add({
        type: "error",
        title: "Something went wrong",
        description: "We couldn't complete your request. Please try again.",
      });
    }
  };

  return (
    <form
      noValidate
      onSubmit={form.handleSubmit(onSubmit)}
      className="
        w-full max-w-[420px]
        bg-background
        p-6 sm:p-8
        shadow-sm
      "
    >
      {/* Brand */}

      <div className="mb-10 flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Socially.</h2>

        <Aperture aria-hidden="true" className="size-6 text-primary" />
      </div>

      <FieldGroup className="gap-5">
        {/* Heading */}

        <div className="mb-2 space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>

          <p className="text-sm text-muted-foreground">
            Sign in to your account.
          </p>
        </div>

        {/* Email */}

        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="email">Email address</FieldLabel>

              <Input
                {...field}
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                aria-invalid={fieldState.invalid}
                aria-describedby={fieldState.error ? "email-error" : undefined}
                className="h-12 rounded-lg"
              />

              {fieldState.error && (
                <div id="email-error">
                  <FieldError>{fieldState.error.message}</FieldError>
                </div>
              )}
            </Field>
          )}
        />

        {/* Password */}

        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <div className="flex justify-between items-center">
                <FieldLabel htmlFor="password">Password</FieldLabel>

                <Link
                  to="/forgot-password"
                  className="
                  text-blue-800
                  text-[10px]
                  font-semibold 
                  hover:underline
                  focus-visible:rounded-sm
                  focus-visible:outline-2
                  focus-visible:outline-primary
                "
                >
                  Forgot-password?
                </Link>
              </div>

              <div className="relative">
                <Input
                  {...field}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Create a password"
                  aria-invalid={fieldState.invalid}
                  aria-describedby={
                    fieldState.error ? "password-error" : "password-help"
                  }
                  className="h-12 rounded-lg pr-12"
                />

                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="
                    absolute right-1 top-1/2
                    flex size-10 -translate-y-1/2
                    items-center justify-center
                    rounded-md text-muted-foreground
                    hover:text-foreground
                    focus-visible:outline-2
                    focus-visible:outline-primary
                  "
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>

              {fieldState.error ? (
                <div id="password-error">
                  <FieldError>{fieldState.error.message}</FieldError>
                </div>
              ) : (
                <FieldDescription id="password-help">
                  Use at least 8 characters.
                </FieldDescription>
              )}
            </Field>
          )}
        />

        {/* Submit */}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-12 w-full rounded-lg"
        >
          {isSubmitting ? (
            <>
              <LoaderCircle
                aria-hidden="true"
                className="mr-2 size-4 animate-spin"
              />
              Creating account...
            </>
          ) : (
            "Create account"
          )}
        </Button>

        {/* signUp */}

        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link
            to="/sign-up"
            className="
              font-semibold text-primary
              hover:underline
              focus-visible:rounded-sm
              focus-visible:outline-2
              focus-visible:outline-primary
            "
          >
            Sign in
          </Link>
        </p>
      </FieldGroup>
    </form>
  );
};

export default SigninForm;
