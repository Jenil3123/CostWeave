import { createContext, useContext, useState } from "react";

const CostContext = createContext<any>(null);

export const CostProvider = ({ children }: any) => {

    const [yarnCost, setYarnCost] = useState(0);
    const [manufacturingCost, setManufacturingCost] = useState(0);

    return (
        <CostContext.Provider
            value={{
                yarnCost,
                setYarnCost,
                manufacturingCost,
                setManufacturingCost
            }}
        >
            {children}
        </CostContext.Provider>
    );
};

export const useCost = () => useContext(CostContext);