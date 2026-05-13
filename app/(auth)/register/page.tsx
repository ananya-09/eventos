import { RegistrationWizard } from '@/components/ui/registration-wizard'

export const metadata = {
  title: 'Register – Eventos',
  description: 'Create your Eventos account and start managing events.',
}

export default function RegisterPage() {
  return (
    <div className="register-card glass-surface-strong rounded-2xl p-8">
      {/* Brand header */}
      <div className="text-center mb-8">
        <p className="text-xs font-semibold tracking-widest text-primary uppercase mb-1">
          Eventos
        </p>
        <h1 className="text-2xl font-bold text-foreground">
          Create Account
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Join thousands of event organizers managing events on Eventos
        </p>
      </div>

      <RegistrationWizard />
    </div>
  )
}
