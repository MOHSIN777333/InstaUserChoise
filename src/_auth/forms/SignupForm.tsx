import { cn } from "cn";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { SignupValidation } from "@/lib/Validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
// cspell:ignore appwrite

import { Link, useNavigate } from "react-router-dom";
import {
  useCreateUserAccount,
  useSignInAccount,
} from "@/lib/react-query/queries";

import { useUserContext } from "@/context/useUseContext";
import { toast } from "@/components/ui/toast";

const SignupForm = () => {
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),

    defaultValues: {
      username: "",
      name: "",
      email: "",
      password: "",
    },
  });

  const {
    mutateAsync: createUserAccount,
    isPending: isCreatingAccountLoading,
  } = useCreateUserAccount();

  const { mutateAsync: signInUserAccount, isPending: isSignInUserLoading } =
    useSignInAccount();

  async function onSubmit(values: z.infer<typeof SignupValidation>) {
    try {
      const newUser = await createUserAccount(values);

      if (!newUser) {
        toast.add({
          type: "error",
          title: "Sign up failed. Please try again.",
        });
      }

      const session = await signInUserAccount({
        email: values.email,
        password: values.password,
      });

      if (!session) {
        toast.add({
          type: "error",
          title: "Something went wrong. Please login your new account",
        });
        navigate("/sign-in");
        return;
      }

      const loggedIn = await checkAuthUser();
      console.log("loggedIn", loggedIn);

      if (loggedIn) {
        form.reset();
        navigate("/");
        toast.add({
          type: "success",
          title: "You successFully logIn",
          description: "WellCome you To InstaUserChoise",
        });
      } else {
        toast.add({ type: "error", title: "Login failed. Please try again." });
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className={cn("flex flex-col gap-6 w-full max-w-xs")}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>

          <p className="text-sm text-balance text-muted-foreground">
            Fill in the form below to create your account
          </p>
        </div>

        {/* User Name */}
        <Field>
          <FieldLabel htmlFor="username">Username</FieldLabel>

          <Controller
            control={form.control}
            name="username"
            render={({ field, fieldState }) => (
              <>
                <Input
                  {...field}
                  id="username"
                  type="text"
                  placeholder=" username"
                />

                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </>
            )}
          />
        </Field>

        {/*  Name */}
        <Field>
          <FieldLabel htmlFor="name"> Name</FieldLabel>

          <Controller
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <>
                <Input {...field} id="name" type="text" placeholder="name" />

                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </>
            )}
          />
        </Field>

        {/* Email */}
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>

          <Controller
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <>
                <Input
                  {...field}
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                />

                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </>
            )}
          />
        </Field>

        {/* Password */}
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>

          <Controller
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <>
                <Input {...field} id="password" type="password" />

                <FieldDescription>
                  Must be at least 8 characters long.
                </FieldDescription>

                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </>
            )}
          />
        </Field>

        {/* Submit */}
        <Field>
          <Button
            type="submit"
            disabled={
              isCreatingAccountLoading ||
              isSignInUserLoading ||
              isSignInUserLoading
            }
          >
            {isCreatingAccountLoading || isSignInUserLoading || isUserLoading
              ? "Loading..."
              : "Create Account"}
          </Button>
        </Field>

        <FieldSeparator>Or continue with</FieldSeparator>

        {/* GitHub */}
        <Field>
          <Button variant="outline" type="button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                fill="currentColor"
              />
            </svg>
            Sign up with GitHub
          </Button>

          <FieldDescription className="px-6 text-center">
            Already have an account? <Link to="/sign-in">Sign in</Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
};

export default SignupForm;
