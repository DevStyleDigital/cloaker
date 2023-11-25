import { type Metadata } from 'next';
import Link from 'next/link';
import { UserAuthForm } from './user-auth-form';

export const metadata: Metadata = {
  title: 'Cloaker | Login',
};

const Login: BTypes.NPage = () => {
  return (
    <main className="flex-1 p-6 flex items-center justify-center">
      <div className="lg:p-8 w-full">
        <div className="mx-auto flex max-w-2xl w-full flex-col justify-center space-y-6">
          <div className="flex flex-col space-y-2 items-center">
            <h1 className="font-bold">Entrar no app</h1>
            <p>
              <span className="text-muted-foreground text-sm">Ou</span>{' '}
              <Link href="/signup">Criar minha conta</Link>
            </p>
          </div>
          <UserAuthForm />
        </div>
      </div>
    </main>
  );
};

export default Login;
