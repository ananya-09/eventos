import { RegistrationWizard } from '@/components/ui/registration-wizard'

export const metadata = {
  title: 'Register – Eventos Workshop',
  description: 'Register for the Eventos university workshop event.',
}

export default function RegisterPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-linear-to-b from-primary/8 via-background to-accent/8 p-4 py-12">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="register-card glass-surface-strong rounded-2xl p-8">
          {/* Brand header */}
          <div className="text-center mb-8">
            <p className="text-xs font-semibold tracking-widest text-primary uppercase mb-1">
              Eventos
            </p>
            <h1 className="text-2xl font-bold text-foreground">
              Workshop Registration
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              University workshop — a few quick steps to save your seat
            </p>
          </div>

          <RegistrationWizard />
        </div>
      </div>
    </div>
  )
}
