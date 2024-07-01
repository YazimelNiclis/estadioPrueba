import Image from "next/image";
import { FaFacebook, FaInstagram, FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-[#1D252D] w-full p-12">
      <div className="flex flex-col items-center justify-between gap-12 px-12 text-center lg:flex-row">
        <a href="#">
          <Image
            className="w-auto "
            src="/tutiLogo.png"
            alt="tuti logo"
            width={128}
            height={128}
          />
        </a>

        <ul className="flex flex-col items-center justify-center gap-4 text-white md:gap-8 md:flex-row">
          <li className="hover:text-[#0ADC8F]">
            <a href="#">Términos y Condiciones</a>
          </li>
          <li className="hover:text-[#0ADC8F]">
            <a href="#">Preguntas Frecuentes</a>
          </li>
          <li className="hover:text-[#0ADC8F]">
            <a href="#">Sobre Nosotros</a>
          </li>
          <li className="hover:text-[#0ADC8F]">
            <a href="#">Quiero vender mi evento</a>
          </li>
        </ul>

        <div className="flex gap-6 text-[#00D19D] mt-6 lg:mt-0">
          <a
            href="https://facebook.com/tutiparaguay"
            className="transition-transform hover:-translate-y-1"
          >
            <FaFacebook size={28} />
          </a>
          <a
            href="https://instagram.com/tutiparaguay"
            className="transition-transform hover:-translate-y-1"
          >
            <FaInstagram size={28} />
          </a>
          <a
            href="https://twitter.com/tutiparaguay"
            className="transition-transform hover:-translate-y-1"
          >
            <FaXTwitter size={28} />
          </a>
        </div>
      </div>
      <p className="mt-16 text-sm text-center text-white opacity-45 lg:px-24 text-pretty ">
        El contenido, precios, servicios y/o productos ofrecidos son de
        exclusiva responsabilidad del Productor y/o Organizador del Evento. El
        Productor/Organizador es el único y exclusivo responsable de la
        producción y organización del Evento. TUTI no se responsabiliza de los
        eventos anunciados en el sitio y queda exento de cualquier
        responsabilidad civil o penal en cuanto a la prestación de tal servicio.
      </p>
    </footer>
  );
}
