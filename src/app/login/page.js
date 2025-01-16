"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  accessCode: z
    .string()
    .min(4, { message: "Access Code must be at least 4 characters." })
    .max(50, { message: "Access Code must be no longer than 50 characters." }),
});

export function LoginForm() {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accessCode: "",
    },
  });

  async function onSubmit(values) {
    const response = { ok: true, data: { role: "worker" } };

    if (response.ok) {
      switch (response.data.role) {
        case "worker":
          router.push("/worker-dashboard");
          break;
        case "manager":
          router.push("/manager-dashboard");
          break;
        case "admin":
          router.push("/admin-dashboard");
          break;
        default:
          console.error("Invalid role");
      }
    } else {
      console.error("Login failed");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        {/* Access Code Field */}
        <FormField
          control={form.control}
          name="accessCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel
                htmlFor="accessCode"
                className="text-lg font-medium text-gray-700"
              >
                Access Code
              </FormLabel>
              <FormControl>
                <Input
                  id="accessCode"
                  placeholder="Enter your access code"
                  className="border border-gray-300 rounded-lg p-4 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-blue-500 transition duration-200 shadow-sm"
                  {...field}
                />
              </FormControl>
              <FormDescription className="text-sm text-gray-500 mt-1">
                Enter the code you received to log in.
              </FormDescription>
              <FormMessage className="text-sm text-red-500 mt-1" />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {form.formState.isSubmitting ? (
            <div className="flex justify-center items-center">
              <div className="h-4 w-4 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
            </div>
          ) : (
            "Log In"
          )}
        </Button>
      </form>
    </Form>
  );
}

export default function LoginPage() {
  return (
    <div className="relative flex justify-center items-center min-h-screen">
      {/* Blurred Background Layer */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat filter blur-sm"
        style={{
          backgroundImage: "url('/construction-site.jpg')",
        }}
      ></div>

      <div className="relative bg-white p-8 rounded-lg shadow-xl w-full sm:max-w-md z-10">
        <h1 className="text-2xl font-semibold text-center text-gray-900 mb-6">Welcome Back</h1>
        <LoginForm />
      </div>
    </div>
  );
}
