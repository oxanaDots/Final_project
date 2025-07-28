import React from 'react';


const InputField= ({ name, placeholder, onChange,  type = "text", register, validationRules, error, options }) => {

  return (
    <div className="flex w-full  flex-col mb-4 ">
        {type === 'select'?(
              <select
              {...register(name, validationRules)}
            
              className={`w-full rounded-[0.3rem] px-3 text-sm py-[0.7rem] bg-zinc-100 outline-blue-600 ${
                error ? "border border-red-600 outline-red-600" : ""
              }`}
            >
              <option className='text-ternary-medium' value="">select a your business category</option>
              {options?.map((opt, idx) => (
                <option key={idx} value={opt.category}>
                  {opt.category}
                </option>
              ))}
            </select>
        ):  <input
        type={type}
        placeholder={placeholder}
    
       
        className={`w-full flex rounded-[0.3rem] px-3 text-sm py-[0.7rem] bg-zinc-100 outline-blue-600 focus:ring-red-500
           ${error ? "border border-red-600 outline-red-600 focus:ring-red-500" : ""}`}
        {...register(name, validationRules)}
         onChange={(e) => {
            if (onChange) onChange(e); // call your prop
          }}
        
      /> }
     
      {error && <p className="text-xs text-red-600 py-1 px-3  text-left">{error.message}</p>}
    </div>
  );
};

export default InputField;
