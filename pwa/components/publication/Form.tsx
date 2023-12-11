import { FunctionComponent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ErrorMessage, Field, FieldArray, Formik } from "formik";
import { useMutation } from "react-query";

import { fetch, FetchError, FetchResponse } from "../../utils/dataAccess";
import { Publication } from "../../types/Publication";

interface Props {
  publication?: Publication;
}

interface SaveParams {
  values: Publication;
}

interface DeleteParams {
  id: string;
}

const savePublication = async ({ values }: SaveParams) =>
  await fetch<Publication>(!values["@id"] ? "/publications" : values["@id"], {
    method: !values["@id"] ? "POST" : "PUT",
    body: JSON.stringify(values),
  });

const deletePublication = async (id: string) =>
  await fetch<Publication>(id, { method: "DELETE" });

export const Form: FunctionComponent<Props> = ({ publication }) => {
  const [, setError] = useState<string | null>(null);
  const router = useRouter();

  const saveMutation = useMutation<
    FetchResponse<Publication> | undefined,
    Error | FetchError,
    SaveParams
  >((saveParams) => savePublication(saveParams));

  const deleteMutation = useMutation<
    FetchResponse<Publication> | undefined,
    Error | FetchError,
    DeleteParams
  >(({ id }) => deletePublication(id), {
    onSuccess: () => {
      router.push("/publications");
    },
    onError: (error) => {
      setError(`Error when deleting the resource: ${error}`);
      console.error(error);
    },
  });

  const handleDelete = () => {
    if (!publication || !publication["@id"]) return;
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    deleteMutation.mutate({ id: publication["@id"] });
  };

  return (
    <div className="container mx-auto px-4 max-w-2xl mt-4">
      <Link
        href="/publications"
        className="text-sm text-cyan-500 font-bold hover:text-cyan-700"
      >
        {`< Back to list`}
      </Link>
      <h1 className="text-3xl my-2">
        {publication
          ? `Edit Publication ${publication["@id"]}`
          : `Create Publication`}
      </h1>
      <Formik
        initialValues={
          publication
            ? {
                ...publication,
                author: publication["author"]?.["@id"] ?? "",
              }
            : new Publication()
        }
        validate={() => {
          const errors = {};
          // add your validation logic here
          return errors;
        }}
        onSubmit={(values, { setSubmitting, setStatus, setErrors }) => {
          const isCreation = !values["@id"];
          saveMutation.mutate(
            { values },
            {
              onSuccess: () => {
                setStatus({
                  isValid: true,
                  msg: `Element ${isCreation ? "created" : "updated"}.`,
                });
                router.push("/publications");
              },
              onError: (error) => {
                setStatus({
                  isValid: false,
                  msg: `${error.message}`,
                });
                if ("fields" in error) {
                  setErrors(error.fields);
                }
              },
              onSettled: () => {
                setSubmitting(false);
              },
            }
          );
        }}
      >
        {({
          values,
          status,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <form className="shadow-md p-4" onSubmit={handleSubmit}>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="publication_title"
              >
                title
              </label>
              <input
                name="title"
                id="publication_title"
                value={values.title ?? ""}
                type="text"
                placeholder=""
                className={`mt-1 block w-full ${
                  errors.title && touched.title ? "border-red-500" : ""
                }`}
                aria-invalid={
                  errors.title && touched.title ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="title"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="publication_summary"
              >
                summary
              </label>
              <input
                name="summary"
                id="publication_summary"
                value={values.summary ?? ""}
                type="text"
                placeholder=""
                className={`mt-1 block w-full ${
                  errors.summary && touched.summary ? "border-red-500" : ""
                }`}
                aria-invalid={
                  errors.summary && touched.summary ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="summary"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="publication_content"
              >
                content
              </label>
              <input
                name="content"
                id="publication_content"
                value={values.content ?? ""}
                type="text"
                placeholder=""
                className={`mt-1 block w-full ${
                  errors.content && touched.content ? "border-red-500" : ""
                }`}
                aria-invalid={
                  errors.content && touched.content ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="content"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="publication_author"
              >
                author
              </label>
              <input
                name="author"
                id="publication_author"
                value={values.author ?? ""}
                type="text"
                placeholder=""
                className={`mt-1 block w-full ${
                  errors.author && touched.author ? "border-red-500" : ""
                }`}
                aria-invalid={
                  errors.author && touched.author ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="author"
              />
            </div>
            <div className="mb-2">
              <div className="text-gray-700 block text-sm font-bold">tags</div>
              <FieldArray
                name="tags"
                render={(arrayHelpers: any) => (
                  <div className="mb-2" id="publication_tags">
                    {values.tags && values.tags.length > 0 ? (
                      values.tags.map((item: any, index: number) => (
                        <div key={index}>
                          <Field name={`tags.${index}`} />
                          <button
                            type="button"
                            onClick={() => arrayHelpers.remove(index)}
                          >
                            -
                          </button>
                          <button
                            type="button"
                            onClick={() => arrayHelpers.insert(index, "")}
                          >
                            +
                          </button>
                        </div>
                      ))
                    ) : (
                      <button
                        type="button"
                        onClick={() => arrayHelpers.push("")}
                      >
                        Add
                      </button>
                    )}
                  </div>
                )}
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="publication_filePath"
              >
                filePath
              </label>
              <input
                name="filePath"
                id="publication_filePath"
                value={values.filePath ?? ""}
                type="text"
                placeholder=""
                className={`mt-1 block w-full ${
                  errors.filePath && touched.filePath ? "border-red-500" : ""
                }`}
                aria-invalid={
                  errors.filePath && touched.filePath ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="filePath"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="publication_publishedAt"
              >
                publishedAt
              </label>
              <input
                name="publishedAt"
                id="publication_publishedAt"
                value={values.publishedAt?.toLocaleString() ?? ""}
                type="dateTime"
                placeholder=""
                className={`mt-1 block w-full ${
                  errors.publishedAt && touched.publishedAt
                    ? "border-red-500"
                    : ""
                }`}
                aria-invalid={
                  errors.publishedAt && touched.publishedAt ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="publishedAt"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="publication_updatedAt"
              >
                updatedAt
              </label>
              <input
                name="updatedAt"
                id="publication_updatedAt"
                value={values.updatedAt?.toLocaleString() ?? ""}
                type="dateTime"
                placeholder=""
                className={`mt-1 block w-full ${
                  errors.updatedAt && touched.updatedAt ? "border-red-500" : ""
                }`}
                aria-invalid={
                  errors.updatedAt && touched.updatedAt ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="updatedAt"
              />
            </div>
            <div className="mb-2">
              <div className="text-gray-700 block text-sm font-bold">
                comments
              </div>
              <FieldArray
                name="comments"
                render={(arrayHelpers) => (
                  <div className="mb-2" id="publication_comments">
                    {values.comments && values.comments.length > 0 ? (
                      values.comments.map((item: any, index: number) => (
                        <div key={index}>
                          <Field name={`comments.${index}`} />
                          <button
                            type="button"
                            onClick={() => arrayHelpers.remove(index)}
                          >
                            -
                          </button>
                          <button
                            type="button"
                            onClick={() => arrayHelpers.insert(index, "")}
                          >
                            +
                          </button>
                        </div>
                      ))
                    ) : (
                      <button
                        type="button"
                        onClick={() => arrayHelpers.push("")}
                      >
                        Add
                      </button>
                    )}
                  </div>
                )}
              />
            </div>
            {status && status.msg && (
              <div
                className={`border px-4 py-3 my-4 rounded ${
                  status.isValid
                    ? "text-cyan-700 border-cyan-500 bg-cyan-200/50"
                    : "text-red-700 border-red-400 bg-red-100"
                }`}
                role="alert"
              >
                {status.msg}
              </div>
            )}
            <button
              type="submit"
              className="inline-block mt-2 bg-cyan-500 hover:bg-cyan-700 text-sm text-white font-bold py-2 px-4 rounded"
              disabled={isSubmitting}
            >
              Submit
            </button>
          </form>
        )}
      </Formik>
      <div className="flex space-x-2 mt-4 justify-end">
        {publication && (
          <button
            className="inline-block mt-2 border-2 border-red-400 hover:border-red-700 hover:text-red-700 text-sm text-red-400 font-bold py-2 px-4 rounded"
            onClick={handleDelete}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};
