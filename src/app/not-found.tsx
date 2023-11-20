import NotFound from 'assets/img/notfound.png';
import Image from 'next/image';
import { GoBack } from './go-back';

const NotFoundPage = () => {
  return (
    <>
      <head>
        <title>Ops... 404</title>
      </head>
      <div className="w-full h-fit min-h-[80vh] py-[2rem] flex justify-center items-center">
        <div className="w-[60%] flex flex-col items-center gap-[.5rem] max-lg:w-[70%] max-sm:w-[100%] max-sm:mt-[3rem]">
          <div className="w-[60%] max-md:w-full h-[60vh] max-md:h-[50vh] min-[2000px]:w-[40%]">
            <Image
              src={NotFound}
              alt="not-found"
              width={2000}
              height={2000}
              className="w-full h-full bg-contain bg-no-repeat bg-center"
            />
          </div>
          <h1 className="font-extrabold text-[2rem] mt-[1rem] text-center max-sm:text-[1.3rem]">
            Ops... Não encontramos essa página
          </h1>
          <span className="text-secondary_black-950/70 text-[1rem] w-[60%]  max-sm:text-[.9rem] text-center max-lg:w-[80%] max-sm:w-[90%]">
            Não encontramos a rota requisitada, clique em {'"voltar"'} para continuar sua
            jornada.
          </span>
          <GoBack />
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;
