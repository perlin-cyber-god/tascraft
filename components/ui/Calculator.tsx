import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Delete, Equal } from 'lucide-react';

export const Calculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [isResult, setIsResult] = useState(false);

  const handlePress = (val: string) => {
    if (isResult) {
      if (['+', '-', '*', '/'].includes(val)) {
        setExpression(display + val);
        setIsResult(false);
      } else {
        setDisplay(val);
        setExpression(val);
        setIsResult(false);
      }
      return;
    }

    if (display === '0' && !['+', '-', '*', '/'].includes(val)) {
      setDisplay(val);
      setExpression(val);
    } else {
      setDisplay(display + val);
      setExpression(expression + val);
    }
  };

  const calculate = () => {
    try {
      // eslint-disable-next-line no-eval
      const res = eval(expression.replace(/x/g, '*'));
      setDisplay(String(res));
      setExpression(String(res));
      setIsResult(true);
    } catch (e) {
      setDisplay('Err');
      setExpression('');
      setIsResult(true);
    }
  };

  const clear = () => {
    setDisplay('0');
    setExpression('');
    setIsResult(false);
  };

  const btnClass = "h-8 sm:h-10 text-lg sm:text-xl font-bold border-b-4 border-r-2 border-t-2 border-l-2 active:translate-y-1 active:border-b-2 transition-all flex items-center justify-center";
  const numBtn = "bg-mc-stone border-b-mc-stoneDark border-r-mc-stoneDark border-t-mc-stoneLight border-l-mc-stoneLight text-white hover:bg-[#555]";
  const opBtn = "bg-[#4a3219] border-b-[#2d1b0d] border-r-[#2d1b0d] border-t-[#6b4522] border-l-[#6b4522] text-[#e0e0e0] hover:bg-[#5c3e20]";
  const actionBtn = "bg-mc-red border-b-[#550000] border-r-[#550000] border-t-[#ff5555] border-l-[#ff5555] text-white hover:bg-[#cc0000]";
  const equalBtn = "bg-mc-green border-b-[#2d4415] border-r-[#2d4415] border-t-[#83d656] border-l-[#83d656] text-white hover:bg-[#4a6b28]";

  return (
    <div className="bg-[#222] p-2 sm:p-3 border-4 border-[#111] shadow-pixel w-full max-w-[300px] font-pixel">
      {/* Display Screen */}
      <div className="bg-[#8b8b8b] border-4 border-[#555] shadow-inner mb-3 p-2 text-right">
        <div className="h-6 sm:h-8 text-black text-xl sm:text-2xl font-mono overflow-hidden whitespace-nowrap">
          {display}
        </div>
      </div>

      {/* Buttons Grid */}
      <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
        <button onClick={clear} className={`${btnClass} ${actionBtn} col-span-1`}>C</button>
        <button onClick={() => handlePress('/')} className={`${btnClass} ${opBtn}`}>/</button>
        <button onClick={() => handlePress('*')} className={`${btnClass} ${opBtn}`}>*</button>
        <button onClick={() => {
            const newExp = expression.slice(0, -1);
            setExpression(newExp || '');
            setDisplay(newExp || '0');
        }} className={`${btnClass} ${opBtn}`}><Delete className="w-4 h-4" /></button>

        {['7', '8', '9'].map(n => (
          <button key={n} onClick={() => handlePress(n)} className={`${btnClass} ${numBtn}`}>{n}</button>
        ))}
        <button onClick={() => handlePress('-')} className={`${btnClass} ${opBtn}`}>-</button>

        {['4', '5', '6'].map(n => (
          <button key={n} onClick={() => handlePress(n)} className={`${btnClass} ${numBtn}`}>{n}</button>
        ))}
        <button onClick={() => handlePress('+')} className={`${btnClass} ${opBtn}`}>+</button>

        {['1', '2', '3'].map(n => (
          <button key={n} onClick={() => handlePress(n)} className={`${btnClass} ${numBtn}`}>{n}</button>
        ))}
        <button onClick={calculate} className={`${btnClass} ${equalBtn} row-span-2`}><Equal className="w-5 h-5" /></button>

        <button onClick={() => handlePress('0')} className={`${btnClass} ${numBtn} col-span-2`}>0</button>
        <button onClick={() => handlePress('.')} className={`${btnClass} ${numBtn}`}>.</button>
      </div>
    </div>
  );
};
