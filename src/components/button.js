const Button = ({ children, className, onClick, type }) => {
  const classes = `py-[8px] px-[10px] bg-primary rounded-[4px] text-white flex justify-center items-center   transform transition-transform duration-300 ease-in-out   hover:bg-primary/20  ${className}`;
  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
};

export default Button;
