import { useState } from "react";
import * as z from "zod";

import { Link, useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Eye, EyeOff, LoaderCircle, Aperture } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";

import { SignupValidation } from "@/lib/Validation";

import {
  useCreateUserAccount,
  useSignInAccount,
} from "@/lib/react-query/queries";

import { useUserContext } from "@/context/useUseContext";
import { signinWithGithub, signinWithGoogle } from "@/lib/appwrite/api";

type SignupValues = z.infer<typeof SignupValidation>;

const SignupForm = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();

  const form = useForm<SignupValues>({
    resolver: zodResolver(SignupValidation),

    defaultValues: {
      username: "",
      name: "",
      email: "",
      password: "",
    },

    mode: "onBlur",
  });

  const {
    mutateAsync: createUserAccount,
    isPending: isCreatingAccountLoading,
  } = useCreateUserAccount();

  const { mutateAsync: signInUserAccount, isPending: isSignInUserLoading } =
    useSignInAccount();

  const isSubmitting =
    form.formState.isSubmitting ||
    isCreatingAccountLoading ||
    isSignInUserLoading;

  async function onSubmit(values: SignupValues) {
    try {
      // Step 1: Create account
      const newUser = await createUserAccount(values);

      if (!newUser) {
        toast.add({
          type: "error",
          title: "Sign up failed",
          description: "Please try again.",
        });

        return;
      }

      // Step 2: Sign in

      let session;

      try {
        session = await signInUserAccount({
          email: values.email,
          password: values.password,
        });
      } catch (error) {
        console.error("Automatic sign-in failed:", error);

        toast.add({
          type: "error",
          title: "Account created",
          description: "Please sign in using your new account.",
        });

        navigate("/sign-in", { replace: true });
        return;
      }

      if (!session) {
        toast.add({
          type: "error",
          title: "Account created",
          description: "Please sign in to continue.",
        });

        navigate("/sign-in", { replace: true });
        return;
      }

      // Step 3: Refresh authentication context

      const loggedIn = await checkAuthUser();

      if (!loggedIn) {
        toast.add({
          type: "error",
          title: "Unable to load your profile",
          description: "Please try signing in again.",
        });
        navigate("/sign-in", { replace: true });
        return;
      }

      // Step 4: Success
      form.reset();

      toast.add({
        type: "success",
        title: "Welcome to Socially!",
        description: "Your account is ready.",
      });

      navigate("/", { replace: true });
    } catch (error) {
      console.error("Signup failed:", error);

      toast.add({
        type: "error",
        title: "Something went wrong",
        description: "We couldn't complete your request. Please try again.",
      });
    }
  }

  return (
    <form
      noValidate
      onSubmit={form.handleSubmit(onSubmit)}
      className="
        w-full max-w-[420px]
        rounded-xl
        
        bg-background
        p-6 sm:p-8
        shadow-sm
      "
    >
      {/* Brand */}

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Socially.</h2>

        <Aperture aria-hidden="true" className="size-6 text-primary" />
      </div>

      <FieldGroup className="gap-2">
        {/* Heading */}

        <div className="mb-2 space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            Create your account
          </h1>

          <p className="text-sm text-muted-foreground">
            Join Socially and start sharing your moments.
          </p>
        </div>

        {/* Full Name */}

        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="name">Full name</FieldLabel>

              <Input
                {...field}
                id="name"
                type="text"
                autoComplete="name"
                placeholder="Your full name"
                aria-invalid={fieldState.invalid}
                aria-describedby={fieldState.error ? "name-error" : undefined}
                className="h-12 rounded-lg"
              />

              {fieldState.error && (
                <div id="name-error">
                  <FieldError>{fieldState.error.message}</FieldError>
                </div>
              )}
            </Field>
          )}
        />

        {/* Username */}

        <Controller
          name="username"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="username">Username</FieldLabel>

              <Input
                {...field}
                id="username"
                type="text"
                autoComplete="username"
                placeholder="your_username"
                aria-invalid={fieldState.invalid}
                aria-describedby={
                  fieldState.error ? "username-error" : "username-help"
                }
                className="h-12 rounded-lg"
              />

              {fieldState.error ? (
                <div id="username-error">
                  <FieldError>{fieldState.error.message}</FieldError>
                </div>
              ) : (
                <FieldDescription id="username-help">
                  Choose a unique username.
                </FieldDescription>
              )}
            </Field>
          )}
        />

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
              <FieldLabel htmlFor="password">Password</FieldLabel>

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
                  onClick={() => setShowPassword((previous) => !previous)}
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
          disabled={isSubmitting || isUserLoading}
          className="h-12 w-full rounded-lg"
        >
          {isSubmitting || isUserLoading ? (
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

        <div className="grid grid-cols-2  gap-2 mt-3 ">
          <Button
            onClick={signinWithGoogle}
            className="
          bg-blue-600 text-white p-3 rounded-lg w-full"
          >
            <img
              src="/public/svgs/google.svg"
              alt="google-svg"
              width="20"
              height="20"
            />
          </Button>
          <Button
            onClick={signinWithGithub}
            className="bg-gray-200 text-gray-800 p-3 rounded-lg w-full"
          >
            <img
              src="/public/svgs/github.svg"
              alt="github-svg"
              width="20"
              height="20"
            />
          </Button>
        </div>

        {/* Login */}

        <p className="text-center text-sm text-muted-foreground mt-2">
          Already have an account?{" "}
          <Link
            to="/sign-in"
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

export default SignupForm;
