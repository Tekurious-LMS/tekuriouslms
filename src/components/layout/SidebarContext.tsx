"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface SidebarContextType {
    collapsed: boolean;
    toggleCollapse: () => void;
    setCollapsed: (collapsed: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
    // Initialize with false, can check localstorage here for persistence if needed
    const [collapsed, setCollapsed] = useState(false);

    // Optional: Persist to localStorage
    useEffect(() => {
        const saved = localStorage.getItem("sidebar-collapsed");
        if (saved) {
            setCollapsed(JSON.parse(saved));
        }
    }, []);

    const toggleCollapse = () => {
        const newState = !collapsed;
        setCollapsed(newState);
        localStorage.setItem("sidebar-collapsed", JSON.stringify(newState));
    };

    return (
        <SidebarContext.Provider value={{ collapsed, toggleCollapse, setCollapsed }}>
            {children}
        </SidebarContext.Provider>
    );
}

export function useSidebar() {
    const context = useContext(SidebarContext);
    if (context === undefined) {
        throw new Error("useSidebar must be used within a SidebarProvider");
    }
    return context;
}
