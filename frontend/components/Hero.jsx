import React from "react"
import Particles from "./Particles"
import Illustration from "/images/glow-bottom.svg"
import Item1 from "/images/item-1.svg"
import ItemLogo from "/images/logonew.svg"

import { Link } from "react-router-dom"
import Hashtag from "../components/hashtag"
import ItemInfo from "../components/ItemInfo"
export default function Hero() {
  return (
    <div className="flex flex-col">
      <img src={Illustration} className="w-full" alt="Hero Illustration" />
{/*
      <div className="flex bg-[#070A10] pb-28">
        <div className="flex flex-col w-2/3 pt-32 pl-14 pr-20">
          <span className="text-[#F7EFFF] font-normal text-[24px] my-6 mt-9">
            Comunidades más activas
          </span>
          <ItemInfo
            img={Item1}
            title="¿Cual es tu serie favorita del 2024?"
            comments="12,345 Comentarios"
            hashtags="#Música"
          />
          <ItemInfo
            img={Item1}
            title="¿Cual es tu serie favorita del 2024?"
            comments="12,345 Comentarios"
            hashtags="#Música"
          />
          <ItemInfo
            img={Item1}
            title="¿Cual es tu serie favorita del 2024?"
            comments="12,345 Comentarios"
            hashtags="#Música"
          />
          <ItemInfo
            img={Item1}
            title="¿Cual es tu serie favorita del 2024?"
            comments="12,345 Comentarios"
            hashtags="#Música"
          />
          <ItemInfo
            img={Item1}
            title="¿Cual es tu serie favorita del 2024?"
            comments="12,345 Comentarios"
            hashtags="#Música"
          />
          <ItemInfo
            img={Item1}
            title="¿Cual es tu serie favorita del 2024?"
            comments="12,345 Comentarios"
            hashtags="#Música"
          />

          <span className="text-[#F7EFFF] font-normal text-[24px] my-6 mt-9">
            Comunidades nuevas
          </span>
          <ItemInfo
            img={Item1}
            title="¿Cual es tu serie favorita del 2024?"
            comments="12,345 Comentarios"
            hashtags="#Música"
          />
          <ItemInfo
            img={Item1}
            title="¿Cual es tu serie favorita del 2024?"
            comments="12,345 Comentarios"
            hashtags="#Música"
          />
          <ItemInfo
            img={Item1}
            title="¿Cual es tu serie favorita del 2024?"
            comments="12,345 Comentarios"
            hashtags="#Música"
          />
          <ItemInfo
            img={Item1}
            title="¿Cual es tu serie favorita del 2024?"
            comments="12,345 Comentarios"
            hashtags="#Música"
          />
          <ItemInfo
            img={Item1}
            title="¿Cual es tu serie favorita del 2024?"
            comments="12,345 Comentarios"
            hashtags="#Música"
          />
          <ItemInfo
            img={Item1}
            title="¿Cual es tu serie favorita del 2024?"
            comments="12,345 Comentarios"
            hashtags="#Música"
          />

          <span className="text-[#F7EFFF] font-normal text-[24px] my-6 mt-9">
            Comunidades nuevas
          </span>
          <ItemInfo
            img={Item1}
            title="¿Cual es tu serie favorita del 2024?"
            comments="12,345 Comentarios"
            hashtags="#Música"
          />
          <ItemInfo
            img={Item1}
            title="¿Cual es tu serie favorita del 2024?"
            comments="12,345 Comentarios"
            hashtags="#Música"
          />
          <ItemInfo
            img={Item1}
            title="¿Cual es tu serie favorita del 2024?"
            comments="12,345 Comentarios"
            hashtags="#Música"
          />
          <ItemInfo
            img={Item1}
            title="¿Cual es tu serie favorita del 2024?"
            comments="12,345 Comentarios"
            hashtags="#Música"
          />
          <div className="flex mt-16 justify-between">
            <div className="flex flex-col">
              <div className="flex items-center border-b border-[#E1C9FB] py-3">
                <span className="text-2xl text-[#F7EFFF] font-normal">
                  Top Videojuegos
                </span>
              </div>
              <div className="flex flex-col pt-4">
                <span className="text-base text-[#F7EFFF] font-normal">
                  The Legend of Zelda: Breath of the Wild
                </span>
                <span className="text-base text-[#F7EFFF] font-normal">
                  The Witcher 3: Wild Hunt
                </span>
                <span className="text-base text-[#F7EFFF] font-normal">
                  Minecraft
                </span>
                <span className="text-base text-[#F7EFFF] font-normal">
                  Red Dead Redemption 2
                </span>
                <span className="text-base text-[#F7EFFF] font-normal">
                  Fortnite
                </span>
                <span className="text-base text-[#F7EFFF] font-normal">
                  Among Us
                </span>
                <span className="text-base text-[#F7EFFF] font-normal">
                  Call of Duty: Warzone
                </span>
                <span className="text-base text-[#F7EFFF] font-normal">
                  Overwatch
                </span>
                <span className="text-base text-[#F7EFFF] font-normal">
                  Animal Crossing: New Horizons
                </span>
                <span className="text-base text-[#F7EFFF] font-normal">
                  Super Mario Odyssey
                </span>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center border-b border-[#E1C9FB] py-3">
                <span className="text-2xl text-[#F7EFFF] font-normal">
                  Top Libros
                </span>
              </div>
              <div className="flex flex-col pt-4">
                <span className="text-base text-[#F7EFFF] font-normal">
                  Cien años de soledad – Gabriel García Márquez
                </span>
                <span className="text-base text-[#F7EFFF] font-normal">
                  1984 – George Orwell
                </span>
                <span className="text-base text-[#F7EFFF] font-normal">
                  Orgullo y prejuicio – Jane Austen
                </span>
                <span className="text-base text-[#F7EFFF] font-normal">
                  Matar a un ruiseñor – Harper Lee
                </span>
                <span className="text-base text-[#F7EFFF] font-normal">
                  El gran Gatsby – F. Scott Fitzgerald
                </span>
                <span className="text-base text-[#F7EFFF] font-normal">
                  Crimen y castigo – Fiódor Dostoyevski
                </span>
                <span className="text-base text-[#F7EFFF] font-normal">
                  Los miserables – Victor Hugo
                </span>
                <span className="text-base text-[#F7EFFF] font-normal">
                  Don Quijote de la Mancha – Miguel de Cervantes
                </span>
                <span className="text-base text-[#F7EFFF] font-normal">
                  El hobbit – J.R.R. Tolkien
                </span>
                <span className="text-base text-[#F7EFFF] font-normal">
                  La sombra del viento – Carlos Ruiz Zafón
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col px-14 py-8">
          <div className="flex flex-col rounded-2xl bg-[#0F0C17] px-7 py-12 mt-20">
            <span className="text-xl text-[#FFFFFF] font-bold">
              Videojuegos
            </span>
            <div className="flex flex-wrap gap-4 mt-5">
              <Hashtag name="#Exitosdelmomento" />
              <Hashtag name="#Exitosdelmomento" />
              <Hashtag name="#Exitosdelmomento" />
              <Hashtag name="#Exitosdelmomento" />
            </div>
            <div className="flex flex-col gap-4 mt-4">
              <ItemInfo
                img={Item1}
                title="¿Cual es tu serie favorita del 2024?"
                comments="12,345 Comentarios"
                hashtags="#Música"
              />
              <ItemInfo
                img={Item1}
                title="¿Cual es tu serie favorita del 2024?"
                comments="12,345 Comentarios"
                hashtags="#Música"
              />
              <ItemInfo
                img={Item1}
                title="¿Cual es tu serie favorita del 2024?"
                comments="12,345 Comentarios"
                hashtags="#Música"
              />
              <ItemInfo
                img={Item1}
                title="¿Cual es tu serie favorita del 2024?"
                comments="12,345 Comentarios"
                hashtags="#Música"
              />
              <ItemInfo
                img={Item1}
                title="¿Cual es tu serie favorita del 2024?"
                comments="12,345 Comentarios"
                hashtags="#Música"
              />
              <ItemInfo
                img={Item1}
                title="¿Cual es tu serie favorita del 2024?"
                comments="12,345 Comentarios"
                hashtags="#Música"
              />
            </div>
          </div>
          <div className="flex flex-col rounded-2xl bg-[#0F0C17] px-7 py-12 mt-20">
            <span className="text-xl text-[#FFFFFF] font-bold">
              Videojuegos
            </span>
            <div className="flex flex-wrap gap-4 mt-5">
              <Hashtag name="#Exitosdelmomento" />
              <Hashtag name="#Exitosdelmomento" />
              <Hashtag name="#Exitosdelmomento" />
              <Hashtag name="#Exitosdelmomento" />
            </div>
            <div className="flex flex-col gap-4 mt-4">
              <ItemInfo
                img={Item1}
                title="¿Cual es tu serie favorita del 2024?"
                comments="12,345 Comentarios"
                hashtags="#Música"
              />
              <ItemInfo
                img={Item1}
                title="¿Cual es tu serie favorita del 2024?"
                comments="12,345 Comentarios"
                hashtags="#Música"
              />
              <ItemInfo
                img={Item1}
                title="¿Cual es tu serie favorita del 2024?"
                comments="12,345 Comentarios"
                hashtags="#Música"
              />
              <ItemInfo
                img={Item1}
                title="¿Cual es tu serie favorita del 2024?"
                comments="12,345 Comentarios"
                hashtags="#Música"
              />
              <ItemInfo
                img={Item1}
                title="¿Cual es tu serie favorita del 2024?"
                comments="12,345 Comentarios"
                hashtags="#Música"
              />
              <ItemInfo
                img={Item1}
                title="¿Cual es tu serie favorita del 2024?"
                comments="12,345 Comentarios"
                hashtags="#Música"
              />
            </div>
          </div>
          <div className="flex flex-col rounded-2xl bg-[#0F0C17] px-7 py-12 mt-20">
            <span className="text-xl text-[#FFFFFF] font-bold">
              Videojuegos
            </span>
            <div className="flex flex-wrap gap-4 mt-5">
              <Hashtag name="#Exitosdelmomento" />
              <Hashtag name="#Exitosdelmomento" />
              <Hashtag name="#Exitosdelmomento" />
              <Hashtag name="#Exitosdelmomento" />
            </div>
            <div className="flex flex-col gap-4 mt-4">
              <ItemInfo
                img={Item1}
                title="¿Cual es tu serie favorita del 2024?"
                comments="12,345 Comentarios"
                hashtags="#Música"
              />
              <ItemInfo
                img={Item1}
                title="¿Cual es tu serie favorita del 2024?"
                comments="12,345 Comentarios"
                hashtags="#Música"
              />
              <ItemInfo
                img={Item1}
                title="¿Cual es tu serie favorita del 2024?"
                comments="12,345 Comentarios"
                hashtags="#Música"
              />
              <ItemInfo
                img={Item1}
                title="¿Cual es tu serie favorita del 2024?"
                comments="12,345 Comentarios"
                hashtags="#Música"
              />
              <ItemInfo
                img={Item1}
                title="¿Cual es tu serie favorita del 2024?"
                comments="12,345 Comentarios"
                hashtags="#Música"
              />
              <ItemInfo
                img={Item1}
                title="¿Cual es tu serie favorita del 2024?"
                comments="12,345 Comentarios"
                hashtags="#Música"
              />
            </div>
          </div>
          <span className="text-2xl text-[#F7EFFF] font-normal my-8 ml-7">
            Usuarios mas activos
          </span>
          <div className="flex justify-between pl-6 pr-8">
            <img src={Item1} width="56px" />
            <div className="flex flex-col">
              <span className="text-2xl text-[#F7EFFF] font-bold">
                @White Warrior
              </span>
              <span className="text-xl text-[#BCBCBC] font-medium">
                124K Followers{" "}
              </span>
            </div>
            <div className="w-20 h-12 flex justify-center items-center bg-[#B577F7] rounded-md text-2xl text-[#FDFCFF] font-medium cursor-pointer">
              Seguir
            </div>
          </div>
          <div className="flex justify-between pl-6 pr-8 py-8">
            <img src={Item1} width="56px" />
            <div className="flex flex-col">
              <span className="text-2xl text-[#F7EFFF] font-bold">
                @White Warrior
              </span>
              <span className="text-xl text-[#BCBCBC] font-medium">
                124K Followers{" "}
              </span>
            </div>
            <div className="w-20 h-12 flex justify-center items-center bg-[#B577F7] rounded-md text-2xl text-[#FDFCFF] font-medium cursor-pointer">
              Seguir
            </div>
          </div>
          <div className="flex justify-between pl-6 pr-8">
            <img src={Item1} width="56px" />
            <div className="flex flex-col">
              <span className="text-2xl text-[#F7EFFF] font-bold">
                @White Warrior
              </span>
              <span className="text-xl text-[#BCBCBC] font-medium">
                124K Followers{" "}
              </span>
            </div>
            <div className="w-20 h-12 flex justify-center items-center bg-[#B577F7] rounded-md text-2xl text-[#FDFCFF] font-medium cursor-pointer">
              Seguir
            </div>
          </div>
        </div>
      </div>
*/}
      <div className="flex flex-col bg-[#1C0536] p-20 h-80">
        <div className="flex justify-between">
          <img src={ItemLogo} />
          <div className="w-[180px] h-[50px] flex rounded-md items-center justify-center bg-[#505CE6] text-sm text-[#E3EFFD] font-medium">
            Inicia o crea tu cuenta
          </div>
        </div>
        <span className="text-sm text-[#FFFFFF] align-middle font-medium m-auto">
          Aviso de privacidad | Términos y condiciones
        </span>
      </div>
    </div>
  )
}
