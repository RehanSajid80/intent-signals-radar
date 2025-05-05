
// This file is a compatibility layer for existing imports
// It re-exports all the functions from the new modular structure

import { saveToSupabase } from './supabase/saveOperations';
import { fetchSupabaseData, fetchAvailableWeeks } from './supabase/fetchOperations';

export {
  saveToSupabase,
  fetchSupabaseData,
  fetchAvailableWeeks
};
