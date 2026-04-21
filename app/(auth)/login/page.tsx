import { signIn } from "./actions"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <Card className="w-full max-w-md shadow-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Masuk</CardTitle>
          <CardDescription>
            Login untuk mengakses dashboard SIMERA.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form action={signIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@email.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
              />
            </div>

            <Button type="submit" className="w-full">
              Masuk
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}