import React, { useState, useEffect, useLayoutEffect, useMemo } from "react";
import { BallTriangle, Triangle } from "react-loader-spinner";
import { useTypewriter, Cursor } from "react-simple-typewriter";

const LoadingExecutedTransaction = ({ message, typed }) => {
  useEffect(() => {}, [message, typed]);

  const [text] = useTypewriter({
    words: [typed],
    loop: true,
    deleteSpeed: 10,
    // delaySpeed: 2000,
  });

  return (
    <div className="flex relative h-72 ">
      <div className="flex flex-col">
        {message ? (
          <ui>
            {message?.map((mess, i) => (
              <li key={mess} className="text-green-500">
                {mess}
              </li>
            ))}
          </ui>
        ) : (
          <></>
        )}

        <div className="text-yellow-500">{text}</div>
      </div>
      <div className=" absolute left-[40%] top-[0%] opacity-100">
        <Triangle
          height="300"
          width="300"
          color="blue"
          ariaLabel="triangle-loading"
          wrapperStyle={{}}
          wrapperClassName=""
          visible={true}
        />
      </div>
      <div className="absolute top-[42%] left-[47%]">
        <BallTriangle
          height={100}
          width={100}
          radius={5}
          color="orange"
          ariaLabel="ball-triangle-loading"
          wrapperClass={{}}
          wrapperStyle=""
          visible={true}
        />
      </div>
    </div>
  );
};

export default LoadingExecutedTransaction;
