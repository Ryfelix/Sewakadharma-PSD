export const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A'
  const date = new Date(dateStr)
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export const getAdminName = (admin) => {
  if (!admin) return 'Unknown'
  return admin.full_name || admin.username || 'Unknown'
}

export const getFileIconBg = (type) => {
  if (!type) return 'bg-gray-100'
  const lower = type.toLowerCase()
  if (lower === 'pdf') return 'bg-red-100'
  if (lower === 'docx' || lower === 'doc') return 'bg-blue-100'
  if (lower === 'txt') return 'bg-green-100'
  return 'bg-gray-100'
}

export const getFileIconColor = (type) => {
  if (!type) return 'text-gray-600'
  const lower = type.toLowerCase()
  if (lower === 'pdf') return 'text-red-600'
  if (lower === 'docx' || lower === 'doc') return 'text-blue-600'
  if (lower === 'txt') return 'text-green-600'
  return 'text-gray-600'
}