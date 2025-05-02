
import React from 'react';
import { useHubspot } from "@/context/HubspotContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MainContent from "@/components/home/MainContent";

const Index = () => {
  const { isAuthenticated } = useHubspot();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <MainContent />
      <Footer />
    </div>
  );
};

export default Index;
