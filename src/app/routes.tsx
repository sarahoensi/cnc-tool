import { Navigate, createHashRouter, Outlet } from "react-router-dom";
import { AppShell } from "@ui/shell/AppShell";

import { CuttingData as CuttingDataPage } from "@ui/pages/cuttingData/cuttingDataPage";
import { HoleMachining as HoleMachiningPage } from "@ui/pages/holeMachining/holeMachiningPage";
import { SpiralMachining as SpiralMachiningPage } from "@ui/pages/spiralMachining/spiralMachiningPage";
import { TriangleSolver as TriangleSolverPage } from "@ui/pages/triangleSolver/triangleSolverPage";

export const router = createHashRouter([
  {
    path: "/",
    element: (
      <AppShell>
        <Outlet />
      </AppShell>
    ),

    children: [
      { index: true, element: <HoleMachiningPage /> },
      { path: "cutting-data", element: <CuttingDataPage /> },
      { path: "spiral", element: <SpiralMachiningPage /> },
      { path: "triangle", element: <TriangleSolverPage /> },
      { path: "*", element: <Navigate to="/" replace /> }
    ],
  },
]);
