import React, { useEffect, useState } from "react";
import { useBalance, useFeeData } from "wagmi";

import { Input } from "antd";

const { utils } = require("ethers");

export default function EtherInput(props) {
  const [mode, setMode] = useState(props.mode ? "USD" : "ETH");
  const [display, setDisplay] = useState();
  const [value, setValue] = useState();
  const [displayMax, setDisplayMax] = useState();

  const currentValue = typeof props.value !== "undefined" ? props.value : value;

  const { data: gas } = useFeeData({ chainId: 5 });
  const { data } = useBalance({
    addressOrName: props.contractAddress,
  });
  console.log("gas price: ", gas);

  let floatBalance = parseFloat("0.00");
  let usingBalance = data.value;

  let gasCost = 0;

  if (usingBalance) {
    if (props.gasPrice) {
      gasCost = (parseInt(props.gasPrice, 10) * 150000) / 10 ** 18;
    }

    const etherBalance = utils.formatEther(usingBalance);

    parseFloat(etherBalance).toFixed(2);
    floatBalance = etherBalance;
    if (floatBalance < 0) {
      floatBalance = 0;
    }
  }

  let displayBalance = floatBalance
    ? floatBalance
    : utils.formatEther(usingBalance);

  const price = props.price;

  function getBalance(_mode) {
    setValue(floatBalance);
    if (_mode === "USD") {
      displayBalance = (floatBalance * price).toFixed(2);
    } else {
      displayBalance = floatBalance;
    }
    return displayBalance;
  }

  useEffect(() => {
    if (!currentValue) {
      setDisplay("");
    }
  }, [currentValue]);

  return (
    <div>
      <span
        style={{
          cursor: "pointer",
          color: "red",
          float: "right",
          marginTop: "-5px",
        }}
        onClick={() => {
          setDisplay(getBalance(mode));
          setDisplayMax(true);
          if (typeof props.onChange === "function") {
            props.onChange(floatBalance);
          }
        }}
      >
        max
      </span>
      <Input
        placeholder={
          props.placeholder ? props.placeholder : "amount in " + mode
        }
        autoFocus={props.autoFocus}
        prefix={mode === "USD" ? "$" : "Ξ"}
        value={display}
        addonAfter={
          !props.price ? (
            ""
          ) : (
            <div
              style={{ cursor: "pointer" }}
              onClick={() => {
                if (mode === "USD") {
                  setMode("ETH");
                  displayMax
                    ? setDisplay(getBalance("ETH"))
                    : setDisplay(currentValue);
                } else if (mode === "ETH") {
                  setMode("USD");
                  if (currentValue) {
                    const usdValue =
                      "" + (parseFloat(currentValue) * props.price).toFixed(2);
                    displayMax
                      ? setDisplay(getBalance("USD"))
                      : setDisplay(usdValue);
                  } else {
                    setDisplay(currentValue);
                  }
                }
              }}
            >
              {mode === "USD" ? "USD 🔀" : "ETH 🔀"}
            </div>
          )
        }
        onChange={async (e) => {
          const newValue = e.target.value;
          setDisplayMax(false);
          if (mode === "USD") {
            const possibleNewValue = parseFloat(newValue);
            if (possibleNewValue) {
              const ethValue = possibleNewValue / props.price;
              setValue(ethValue);
              if (typeof props.onChange === "function") {
                props.onChange(ethValue);
              }
              setDisplay(newValue);
            } else {
              setDisplay(newValue);
            }
          } else {
            setValue(newValue);
            if (typeof props.onChange === "function") {
              props.onChange(newValue);
            }
            setDisplay(newValue);
            {
              console.log("new value", newValue);
            }
          }
        }}
      />
    </div>
  );
}
