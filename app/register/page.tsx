import { RegistrationWizard } from '@/components/registration/registration-wizard'

export const metadata = {
  title: 'Register – Eventos Workshop',
  description: 'Register for the Eventos university workshop event.',
}

export default function RegisterPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-b from-amber-50/40 to-background dark:from-amber-950/10 dark:to-background p-4 py-12">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white dark:bg-[#151616] rounded-2xl shadow-lg border border-border/40 p-8">
          {/* Brand header */}
          <div className="text-center mb-8">
            <p className="text-xs font-semibold tracking-widest text-amber-500 uppercase mb-1">
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
