import { createContext, useContext, useState } from "react";

const CostContext = createContext<any>(null);

export const CostProvider = ({ children }: any) => {

    /* Yarn Construction */
    const [warpCount, setWarpCount] = useState(0);
    const [weftCount, setWeftCount] = useState(0);
    const [fabricWidth, setFabricWidth] = useState(0);
    const [totalEnds, setTotalEnds] = useState(0);
    const [ppi, setPpi] = useState(0);

    /* Costing */
    const [yarnCost, setYarnCost] = useState(0);
    const [manufacturingCost, setManufacturingCost] = useState(0);

    /* Production */
    const [totalMeters, setTotalMeters] = useState(0);

    return (
        <CostContext.Provider
            value={{
                /* Yarn */
                warpCount,
                setWarpCount,
                weftCount,
                setWeftCount,
                fabricWidth,
                setFabricWidth,
                totalEnds,
                setTotalEnds,
                ppi,
                setPpi,

                /* Costing */
                yarnCost,
                setYarnCost,
                manufacturingCost,
                setManufacturingCost,

                /* Production */
                totalMeters,
                setTotalMeters
            }}
        >
            {children}
        </CostContext.Provider>
    );
};

export const useCost = () => useContext(CostContext);