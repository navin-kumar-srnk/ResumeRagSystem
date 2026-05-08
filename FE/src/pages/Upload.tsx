

import React, { useRef, useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  IconButton, 
  Avatar, 
  Grid, 
  useMediaQuery, 
  useTheme,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Skeleton
} from '@mui/material';
import { 
  CloudUpload, 
  Rocket, 
  User, 
  Upload, 
  BarChart3, 
  CircleDot
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUploadMutation } from '../reactQuery/mutations';
import { useStats } from '../reactQuery/queries';

// Custom MUI theme to match the "Cognitive Curator" design spec
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#89ceff',
    },
    background: {
      default: '#060e20',
      paper: '#05183c',
    },
    text: {
      primary: '#dee5ff',
      secondary: '#91aaeb',
    },
  },
  typography: {
    fontFamily: '"Inter", sans-serif',
    h1: {
      fontFamily: '"Manrope", sans-serif',
      fontWeight: 800,
    },
    h2: {
      fontFamily: '"Manrope", sans-serif',
      fontWeight: 700,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          padding: '10px 24px',
        },
      },
    },
  },
});


export default function UploadComp() {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]); // Track selected files
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for the hidden input
  
  const theme = useTheme();

  // 1. Logic to handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(filesArray);
    }
  };

  // 2. Logic to handle the Drop event
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      const filesArray = Array.from(e.dataTransfer.files).filter(f => f.type === 'application/pdf');
      setSelectedFiles(filesArray);
    }
  };


  const { mutateAsync, isPending } = useUploadMutation();

  const handleStartUpload = async () => {
    if (selectedFiles.length === 0) return;

    try {
      // If uploading multiple, we use Promise.all to hit the endpoint in parallel
      await Promise.all(selectedFiles.map(file => mutateAsync(file)));
      
      alert("All files indexed successfully!");
      setSelectedFiles([]); // Clear selection on success
    } catch (err) {
      alert("Error during ingestion. Check console.");
    }

  }

  const { data: stats, isLoading } = useStats();



  const statsData = [
    { 
      label: 'Resumes', 
      value: stats?.files_indexed?.length ?? '0' 
    },
    { 
      label: 'Chunks', 
      value: stats?.total_chunks  || '0' 
    },
    { 
      label: 'Capacity', 
      value: '42%' 
    },
  ];
  const totalSizeMB = (selectedFiles.reduce((acc, file) => acc + file.size, 0) / (1024 * 1024)).toFixed(2);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      {/* Hidden File Input */}
      <input 
        type="file" 
        multiple 
        accept=".pdf" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        style={{ display: 'none' }} 
      />

      <Box className="min-h-screen flex flex-col selection:bg-primary/30">
        <main className="flex-1 flex flex-col items-center justify-center px-6 py-6">
          <Container maxWidth="md" className="text-center space-y-12">
            
            <motion.header 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <Typography variant="h2" className="text-4xl md:text-5xl tracking-tight">
                Resume Ingestion
              </Typography>
            </motion.header>

            {/* Upload Zone */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full"
            >
              <Box 
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()} // Trigger input on click
                className={`
                  relative overflow-hidden rounded-[3rem] p-16 border-2 border-dashed transition-all duration-500 cursor-pointer group
                  ${isDragging ? 'border-primary bg-primary/10' : 'border-white/10 bg-white/5 hover:border-primary/50 hover:bg-white/10'}
                  shadow-2xl
                `}
              >
                <Box className="flex flex-col items-center justify-center text-center space-y-8 relative z-10">
                  <motion.div 
                    animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
                    className="w-24 h-24 rounded-[2.5rem] bg-white/5 flex items-center justify-center shadow-2xl border border-white/10"
                  >
                    <CloudUpload size={48} className="text-primary" />
                  </motion.div>

                  <Box className="space-y-2">
                    <Typography variant="h5" className="font-bold">
                      {selectedFiles.length > 0 ? `${selectedFiles.length} files selected` : 'Drop your assets here'}
                    </Typography>
                    <Typography color="textSecondary">
                      {selectedFiles.length > 0 
                        ? selectedFiles.map(f => f.name).join(', ') 
                        : 'PDF supported (Max 50MB per file)'}
                    </Typography>
                  </Box>

                  {selectedFiles.length === 0 && (
                    <Button variant="outlined" color="primary" className="rounded-2xl">
                      Browse Files
                    </Button>
                  )}
                </Box>
              </Box>
            </motion.div>

            {/* Action Button - Only shows up if files are selected */}
            <AnimatePresence>
              {selectedFiles.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="flex flex-col items-center gap-4"
                >
                  <Button
      onClick={handleStartUpload}
      disabled={isPending} // Disable button while uploading
      variant="contained"
      color="primary"
      className="w-full sm:w-80 py-5 rounded-2xl font-black text-lg shadow-xl uppercase tracking-widest"
      startIcon={isPending ? <CircleDot className="animate-spin" /> : <Rocket size={20} />}
    >
      {isPending ? "Indexing..." : "Start Upload"}
    </Button>
                  <Typography className="text-xs text-secondary font-medium uppercase tracking-tighter">
                    Ready to index {selectedFiles.length} files ({totalSizeMB} MB total)
                  </Typography>
                </motion.div>
              )}
            </AnimatePresence>

             {/* Stats Footer */}
    <Box className="pt-12 border-t border-outline-variant/10 grid grid-cols-3 gap-8">
      {statsData.map((stat, idx) => (
        <motion.div 
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 + idx * 0.1 }}
        >
          {/* Conditional Rendering: Show Skeleton if loading, otherwise show Value */}
          {isLoading ? (
            <Skeleton 
              variant="text" 
              width="60%" 
              height={48} 
              sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)', borderRadius: 1 }} 
            />
          ) : (
            <Typography variant="h4" className="font-headline font-bold">
              {stat.value}
            </Typography>
          )}

          <Typography className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">
            {stat.label}
          </Typography>
        </motion.div>
      ))}
    </Box>

          </Container>
        </main>
      </Box>
    </ThemeProvider>
  );
}