'use client'

import useSWR from 'swr'
import axios from 'axios'
import { useCallback } from 'react'

const API_URL = 'http://localhost:8000/api/especies'

export interface Especie {
  especie_id: number
  nombre_comun: string
  nombre_cientifico?: string
}

export interface EspecieCreate {
  nombre_comun: string
  nombre_cientifico?: string
}

export interface EspecieUpdate {
  nombre_comun?: string
  nombre_cientifico?: string
}

const fetcher = (url: string) => axios.get(url).then(res => res.data)

export function useEspecies() {
  const { data, error, isLoading, mutate } = useSWR<Especie[]>(API_URL, fetcher)

  const getById = useCallback(async (id: number): Promise<Especie | null> => {
    try {
      const res = await axios.get(`${API_URL}/${id}`)
      return res.data
    } catch (err) {
      return null
    }
  }, [])

  const create = useCallback(async (payload: EspecieCreate): Promise<Especie | null> => {
    try {
      const res = await axios.post(API_URL, payload)
      mutate() // Refresh list
      return res.data
    } catch (err) {
      return null
    }
  }, [mutate])

  const update = useCallback(async (id: number, payload: EspecieUpdate): Promise<Especie | null> => {
    try {
      const res = await axios.put(`${API_URL}/${id}`, payload)
      mutate() // Refresh list
      return res.data
    } catch (err) {
      return null
    }
  }, [mutate])

  const remove = useCallback(async (id: number): Promise<boolean> => {
    try {
      await axios.delete(`${API_URL}/${id}`)
      mutate() // Refresh list
      return true
    } catch (err) {
      return false
    }
  }, [mutate])

  return {
    especies: data,
    isLoading,
    error,
    getById,
    create,
    update,
    remove,
    refresh: mutate
  }
}
