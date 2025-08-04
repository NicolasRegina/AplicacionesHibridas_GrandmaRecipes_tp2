import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

export const useModerationCounts = () => {
  const [counts, setCounts] = useState({
    pendingGroups: 0,
    pendingRecipes: 0,
    loading: true
  })
  const { user } = useAuth()

  useEffect(() => {
    const fetchCounts = async () => {
      if (!user || user.role !== 'admin') {
        setCounts({ pendingGroups: 0, pendingRecipes: 0, loading: false })
        return
      }

      try {
        const token = localStorage.getItem('token')
        
        // Obtener grupos pendientes
        const groupsResponse = await fetch('/api/groups/moderation/pending', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        
        // Obtener recetas pendientes
        const recipesResponse = await fetch('/api/recipes/moderation/pending', {
          headers: { 'Authorization': `Bearer ${token}` }
        })

        const groupsData = groupsResponse.ok ? await groupsResponse.json() : []
        const recipesData = recipesResponse.ok ? await recipesResponse.json() : []

        setCounts({
          pendingGroups: groupsData.length || 0,
          pendingRecipes: recipesData.length || 0,
          loading: false
        })
      } catch (error) {
        console.error('Error fetching moderation counts:', error)
        setCounts({ pendingGroups: 0, pendingRecipes: 0, loading: false })
      }
    }

    fetchCounts()
    
    // Actualizar cada 5 minutos
    const interval = setInterval(fetchCounts, 5 * 60 * 1000)
    
    return () => clearInterval(interval)
  }, [user])

  return counts
}
