import { useQuery } from 'react-query';
import { createFetch } from '../utils/fetch';
import { API_URL } from '../constants';
import { ITodo } from '../types';

export const useQueryTodosList = () =>
  useQuery('todos_list', createFetch<ITodo[]>(`${API_URL}todos`));
