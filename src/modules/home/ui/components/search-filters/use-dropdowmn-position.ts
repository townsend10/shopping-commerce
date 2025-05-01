// RefObject interação com elemento do DOM
import { RefObject } from "react";

export const useDropdownPosition = (
  ref: RefObject<HTMLDivElement | null> | RefObject<HTMLDivElement>
) => {
  const getDropdownPosition = () => {
    // caso nao haja um subcategory vamos definir essa posiçao
    if (!ref.current) return { top: 0, left: 0 };

    const rect = ref.current.getBoundingClientRect();
    const dropDownWidth = 240;

    // Calcula posiçao inicial
    let left = rect.left + window.scrollX;
    const top = rect.bottom + window.scrollY;

    // Verifica se o dropdown pode sair da borda
    if (left + dropDownWidth > window.innerWidth) {
      left = rect.right + window.scrollX - dropDownWidth;
    }

    // Se continuar do lado de fora da borda, alinha com algum "padding"
    if (left < 0) {
      left = window.innerWidth - dropDownWidth - 16;
    }

    // Garante que não passe da borda esquerda
    if (left < 0) {
      left = 16;
    }

    return { top, left };
  };

  return { getDropdownPosition };
};
