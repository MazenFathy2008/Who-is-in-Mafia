const labelStyles = `
        absolute
          z-100
          select-none
          top-1/2
          -translate-y-1/2
          left-4
          text-font
          opacity-50
          transition-all
          duration-200
          peer-focus:opacity-100
          peer-focus:-top-5
          peer-focus:left-5 
          peer-focus:sm:left-10 
          peer-focus:scale-125
          peer-focus:sm:scale-150
          peer-not-placeholder-shown:opacity-100
          peer-not-placeholder-shown:-top-5
          peer-not-placeholder-shown:left-5 
          peer-not-placeholder-shown:sm:left-10 
          peer-not-placeholder-shown:scale-125 
          peer-not-placeholder-shown:sm:scale-150

  `;
const inputStyles = `
        border-3
        border-Im1
        focus:border-Im2
        transtion
        duration-200
        w-full
        outline-0
        p-2
        box-border
        rounded-2xl
        peer
  `;
const containerStyles = `
      flex
      flex-col
      gap-2
      w-full
      relative
      

  `;
const buttonStyles = `
  z-10 cursor-pointer
  hover:scale-125
  transtion
  duration-200
  border-b-xl
  border-b-font
  underline
  `;
export { inputStyles, labelStyles, containerStyles, buttonStyles };
