"use client"
import { useState } from 'react';
import { getToken } from '@/lib/utils';


export default function useGeneric() {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const GenericDelete = async (rota, id, caminho, campo) => {
        const token = getToken();
        if (!token || !id) setError('Sem token!');

        setError('');
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${rota}/${caminho}?${campo}=${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            const response = await res.json();
            if (!res.ok) setError("Erro na requisição");

            return (response.message);

        } catch (error) {
            setError(`Erro ao tentar excluir ${caminho}: ${error.message}`)
        } finally {
            setLoading(false);
        }
    };

    const GenericDeleteRelation = async (rota, caminho, campo1, campo2, id1, id2) => {
        const token = getToken();
        if (!token) setError('Sem token!');

        setError('');
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${rota}/${caminho}?${campo1}=${id1}&&${campo2}=${id2}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            console.log(res);

            const response = await res.json();
            if (!res.ok) setError("Erro na requisição");

            return (response.message);

        } catch (error) {
            setError(`Erro ao tentar excluir ${caminho}: ${error.message}`)
        } finally {
            setLoading(false);
        }
    };

    const GenericCreate = async (rota, caminho, body) => {
        const token = getToken();
        if (!token) {
            setError('Sem token!');
            return;
        }

        setError('');
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${rota}/${caminho}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });

            const resJSON = await res.json();

            if (!res.ok) {
                setError(resJSON?.message || 'Erro na criação');
            }

            return { resJSON, res };
        } catch (error) {
            setError(`Erro ao criar ${caminho}: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const GenericSearch = async (rota, caminho, pesquisa = null) => {
        const token = getToken();
        if (!token) setError('Sem token!');

        setError('');
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${rota}/${caminho}${pesquisa}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            let response = await res.json();
            if (!res.ok) setError("Erro na requisição");

            return response;
        } catch (error) {
            setError(`Erro ao tentar buscar ${caminho}: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    const GenericUpdate = async (rota, caminho, body) => {
        const token = getToken();
        if (!token) {
            setError('Sem token!');
            return null;
        }

        setError('');
        setLoading(true);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${rota}/${caminho}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            const response = await res.json();

            if (!res.ok) {
                setError(response?.message || "Erro na requisição");
                return null;
            }

            return response;
        } catch (error) {
            setError(`Erro ao tentar buscar ${caminho}: ${error.message}`);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { GenericDelete, GenericCreate, GenericUpdate, GenericSearch, GenericDeleteRelation, loading, error }
}
