/*
 * jQuery eUtils v0.1
 * https://github.com/hubgit/jquery-eutils
 *
 * Copyright 2014 Alf Eaton
 * Released under the MIT license
 * http://git.macropus.org/mit-license/
 *
 * Date: 2014-01-16
 */
 (function($) {
 	$.eutils = {
 		base: 'http://eutils.ncbi.nlm.nih.gov/entrez/eutils/',
 		db: 'pubmed',
 		search: function(term) {
 			var deferred = $.Deferred();
 			var promise = deferred.promise();

 			var request = $.ajax({
 				url: $.eutils.base + 'esearch.fcgi',
 				data: {
 					db: $.eutils.db,
 					retmode: 'xml',
 					usehistory: 'y',
 					retmax: 0,
 					term: term
 				},
 				dataType: 'xml',
 			});

 			request.done(function(doc, status, xhr) {
 				var template = [
	 				'/eSearchResult',
	 				{
	 					count: 'Count',
	 					webenv: 'WebEnv',
	 					querykey: 'QueryKey'
	 				}
 				];

 				if (doc) {
 					var result = Jath.parse(template, doc);
 					deferred.resolve(result[0], status, xhr);
 				} else {
 					deferred.reject(request, 'error');
 				}
 			});

 			request.fail(function(jqXHR, status, error) {
 				deferred.reject(jqXHR, status, error);
 			});

 			return promise;
 		},

 		summary: function(result, retmax, retstart) {
 			var deferred = $.Deferred();
 			var promise = deferred.promise();

 			var request = $.ajax({
 				url: $.eutils.base + 'esummary.fcgi',
 				data: {
 					db: $.eutils.db,
 					retmode: 'xml',
 					WebEnv: result.webenv,
 					query_key: result.querykey,
 					retmax: retmax || 10,
 					retstart: retstart || 0,
 				},
 				dataType: 'xml',
 			});

 			request.done(function(doc, status, xhr) {
 				var template = [
	 				'/eSummaryResult/DocSum',
	 				{
	 					id: 'Id',
	 					doi: 'Item[@Name="ArticleIds"]/Item[@Name="doi"]',
	 					pmc: 'Item[@Name="ArticleIds"]/Item[@Name="pmc"]',
	 					title: 'Item[@Name="Title"]',
	 				}
 				];

 				if (doc) {
 					var result = Jath.parse(template, doc);
 					deferred.resolve(result, status, xhr);
 				} else {
 					deferred.reject(request, 'error');
 				}
 			});

 			request.fail(function(jqXHR, status, error) {
 				deferred.reject(jqXHR, status, error);
 			});

 			return promise;
 		}
 	};
 })(jQuery);