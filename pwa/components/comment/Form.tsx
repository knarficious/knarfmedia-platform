import { FunctionComponent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ErrorMessage, Formik } from "formik";
import { useMutation } from "react-query";

import { fetch, FetchError, FetchResponse } from "../../utils/dataAccess";
import { Comment } from "../../types/Comment";

interface Props {
  comment?: Comment;
}

interface SaveParams {
  values: Comment;
}

interface DeleteParams {
  id: string;
}

const saveComment = async ({ values }: SaveParams) =>
  await fetch<Comment>(!values["@id"] ? "/comments" : values["@id"], {
    method: !values["@id"] ? "POST" : "PUT",
    body: JSON.stringify(values),
  });

const deleteComment = async (id: string) =>
  await fetch<Comment>(id, { method: "DELETE" });

export const Form: FunctionComponent<Props> = ({ comment }) => {
  const [, setError] = useState<string | null>(null);
  const router = useRouter();

  const saveMutation = useMutation<
    FetchResponse<Comment> | undefined,
    Error | FetchError,
    SaveParams
  >((saveParams) => saveComment(saveParams));

  const deleteMutation = useMutation<
    FetchResponse<Comment> | undefined,
    Error | FetchError,
    DeleteParams
  >(({ id }) => deleteComment(id), {
    onSuccess: () => {
      router.push("/comments");
    },
    onError: (error) => {
      setError(`Error when deleting the resource: ${error}`);
      console.error(error);
    },
  });

  const handleDelete = () => {
    if (!comment || !comment["@id"]) return;
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    deleteMutation.mutate({ id: comment["@id"] });
  };

  return (
    <div className="container mx-auto px-4 max-w-2xl mt-4">
      <Link
        href="/comments"
        className="text-sm text-cyan-500 font-bold hover:text-cyan-700"
      >
        {`< Back to list`}
      </Link>
      <h1 className="text-3xl my-2">
        {comment ? `Edit Comment ${comment["@id"]}` : `Create Comment`}
      </h1>
      <Formik
        initialValues={
          comment
            ? {
                ...comment,
              }
            : new Comment()
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
                router.push("/comments");
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
                htmlFor="comment_content"
              >
                content
              </label>
              <input
                name="content"
                id="comment_content"
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
                htmlFor="comment_post"
              >
                post
              </label>
              <input
                name="post"
                id="comment_post"
                value={values.post ?? ""}
                type="text"
                placeholder=""
                className={`mt-1 block w-full ${
                  errors.post && touched.post ? "border-red-500" : ""
                }`}
                aria-invalid={errors.post && touched.post ? "true" : undefined}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="post"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="comment_publishedAt"
              >
                publishedAt
              </label>
              <input
                name="publishedAt"
                id="comment_publishedAt"
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
                htmlFor="comment_author"
              >
                author
              </label>
              <input
                name="author"
                id="comment_author"
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
        {comment && (
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
