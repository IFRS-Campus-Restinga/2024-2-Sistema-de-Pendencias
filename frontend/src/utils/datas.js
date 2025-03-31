export const getDataMaxima = () => {
    const hoje = new Date();
    hoje.setFullYear(hoje.getFullYear() - 15);
    return hoje.toISOString().split("T")[0];
};